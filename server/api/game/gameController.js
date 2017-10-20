import Game from "./gameModel";
import { status } from "../../util/constants";
import fs from 'fs';
import AWS from 'aws-sdk';
import path from 'path';
import childProcess from 'child_process';
import phantomjs from 'phantomjs-prebuilt';
import ParseData from "wl-parser";
import Transaction from "../transaction/transactionModel";
import facebookController from "../facebook/facebookController";
let binPath = process.env.NODE_ENV !== 'production' ? path.join(__dirname, "../../../node_modules/phantomjs-prebuilt/bin/phantomjs") : "phantomjs";

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_HOSTED_REGION
});

let s3Bucket = new AWS.S3();

let filterObject = (userInfo) => {
    let filterObject = {};
    if (userInfo === undefined) {
        console.log("Adding fake email address");
        filterObject.createdBy = "";
    } else {
        switch (userInfo.type) {
            case "developer":
                filterObject.createdBy = userInfo.email;
                break;
            case "admin":
                break;
        }
    }
    return filterObject;
}

exports.params = function (req, res, next, id) {
    Game.findById(id)
        .then((game) => {
            if (!game) {
                next(new Error("No game with id", id));
            } else {
                req.game = game;
                next();
            }
        }, (err) => {
            next(err);
        })
}

exports.get = function (req, res, next) {
    let objectFilter = filterObject(req.user);
    let perPage = req.query.pp;
    let pageNumber = req.query.pn;
    if (perPage && pageNumber) {
        perPage = +perPage;
        pageNumber = +pageNumber - 1;
        Game.count(objectFilter, (err, count) => {
            Game.find(objectFilter).skip(pageNumber * perPage).limit(perPage)
                .then((games) => {
                    let data = {};
                    data.items = games;
                    data.count = count;
                    res.json(data);
                }, function (err) {
                    next(err);
                })
        });
    } else {
        Game.find(objectFilter)
            .then((games) => {
                res.json(games);
            }, (err) => {
                next(err);
            })
    }
}

exports.post = function (req, res, next) {
    let body = req.body;
    let questionObject = {};
    questionObject.title = body.title;
    questionObject.description = body.description;
    questionObject.introImage = body.introImage;
    questionObject.outputText = body.outputText;
    questionObject.dom = body.dom;
    questionObject.createdBy = req.user.email;

    let newGame = new Game(questionObject);
    newGame.save((err, newGame) => {
        if (err) {
            next(err);
        } else {
            res.json(newGame);
        }
    })
}

exports.getOne = function (req, res, next) {
    let game = req.game;
    if (game.createdBy === req.user.email || req.user.type === "admin") {
        res.json(game);
    } else {
        next(new Error("Not Authorised to view"));
    }
}

exports.putOne = function (req, res, next) {
    let objectFilter = filterObject(req.user);
    objectFilter._id = req.game.id;
    Game.find(objectFilter)
        .then((game) => {
            let createdBy = game[0].createdBy;
            let toUpdateWith = req.body;
            toUpdateWith.createdBy = createdBy || req.user.email;
            toUpdateWith.status = status.DEVELOPING;
            Game.findOneAndUpdate(objectFilter, toUpdateWith, { upsert: true })
                .then((success, err) => {
                    if (err) return res.send(500, { error: err });
                    return res.json(success);
                });
        })
}

exports.deleteOne = function (req, res, next) {
    let objectFilter = filterObject(req.user);
    objectFilter._id = req.game.id;
    let deleted = Game.find(objectFilter).remove().exec();
    res.json(deleted);
}

exports.postOne = function (req, res, next) {
    let startTime = Date.now();
    let body = req.body;
    let questionID = body.questionID;
    let userID = body.userid;
    let accessToken = body.token;
    let userData = {};
    let promiseArray = [];

    //get the facebook details
    facebookController.updateFacebookData(userID, accessToken)
        .then((facebookData) => {
            console.log("Inside facebookData");
            return Game.findById(questionID)
                .then((game) => {
                    let dom = game.dom;
                    let output = game.outputText;
                    let parseData = new ParseData(facebookData, Date.now());
                    return parseData.makeConnections().then(() => {
                        let domElement = parseData.analizeDomElement(dom);
                        let outputElement = parseData.analizeDomElement(output);
                        return [domElement, outputElement];
                    })
                })
        })
        .then((arrayOutput) => {
            console.log("inside array output");
            let newDom = arrayOutput[0];
            let newOutputDom = arrayOutput[1];
            let fileNameData = Date.now();
            let fileName = "image" + fileNameData + ".jpg";
            let childArgs = [
                path.join(__dirname, '../../../makeImage.js'),
                newDom,
                fileName
            ]
            childProcess.execFile(binPath, childArgs, (err, stdout, stderr) => {
                console.log("Inside python responce");
                let data = fs.readFileSync(fileName);
                let stream = {
                    Bucket: process.env.QUIZ_IMAGE,
                    Key: fileName,
                    ACL: 'public-read',
                    Body: data,
                    ContentType: 'image/jpg'
                };
                s3Bucket.upload(stream, (err, data) => {
                    console.log("Image uploaded to s3");
                    if (err) {
                        console.log(err);
                        console.log('Error uploading data: ', data);
                        next(err);
                    } else {
                        startTime = Date.now() - startTime;
                        console.log("Total time " + startTime + " msec");
                        //delete local file
                        fs.unlink(fileName);
                        let transactionData = { _id: fileNameData, imageName: fileName, questionID: questionID, outputText: newOutputDom, facebookID: userID };
                        let transaction = new Transaction(transactionData);
                        return transaction.save()
                            .then((tran) => {
                                if (res) {
                                    data.transactionID = tran._id;
                                    res.json(data);
                                }
                                return data;
                            })
                            .catch((err) => {
                                if (res)
                                    res.send(err);
                                return err;
                            })
                    }
                });
            })
        })
}