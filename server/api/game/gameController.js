var logger = require('../../util/logger');
var rp = require('request-promise');
var Game = require("./gameModel");
var fs = require('fs');
var AWS = require('aws-sdk');
var path = require('path');
var Promise = require('bluebird');
var childProcess = require('child_process')
var phantomjs = require('phantomjs-prebuilt')
var binPath = process.env.NODE_ENV !== 'production' ? path.join(__dirname, "../../../node_modules/phantomjs-prebuilt/bin/phantomjs") : "phantomjs";
var ParseData = require("wl-parser").default;
var mongoose = require("mongoose");
var Transaction = require("../transaction/transactionModel");
mongoose.Promise = require('bluebird');

var facebookController = require("../facebook/facebookController");

const ABOUT_ME = "getAboutMe";
const ABOUT_FRIENDS = "getCloseFriends";
const SIZE = 160;

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_HOSTED_REGION
});

var s3Bucket = new AWS.S3();

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
    let perPage = req.query.pp;
    let pageNumber = req.query.pn;
    if (perPage && pageNumber) {
        perPage = +perPage;
        pageNumber = +pageNumber - 1;
        Game.count({}, (err, count) => {
            Game.find({}).skip(pageNumber * perPage).limit(perPage)
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
        Game.find({})
            .then((games) => {
                res.json(games);
            }, (err) => {
                next(err);
            })
    }
}

exports.post = function (req, res, next) {
    var body = req.body;

    var newGame = new Game();
    newGame.title = body['title'];
    newGame.introImage = body['introImage'];
    newGame.outputText = body['outputText'];
    newGame.dom = body['dom'];

    newGame.save((err, newGame) => {
        if (err) {
            next(err);
        } else {
            res.json(newGame);
        }
    })
}

exports.getOne = function (req, res, next) {
    var game = req.game;
    res.json(game);
}

exports.putOne = function (req, res, next) {
    // var object = Game.findById(req.id);
    Game.findOneAndUpdate({ _id: req.game.id }, req.body, { upsert: true })
        .then((success, err) => {
            if (err) return res.send(500, { error: err });
            return res.json(success);
        });
}

exports.deleteOne = function (req, res, next) {
    var deleted = Game.find({ _id: req.game.id }).remove().exec();
    res.json(deleted);
}

exports.postOne = function (req, res, next) {
    var startTime = Date.now();
    var body = req.body;
    var questionID = body.questionID;
    var userID = body.userid;
    var accessToken = body.token;
    var userData = {};
    var promiseArray = [];

    //get the facebook details
    facebookController.updateFacebookData(userID, accessToken)
        .then((facebookData) => {
            return Game.findById(questionID)
                .then((game) => {
                    var dom = game.dom;
                    var output = game.outputText;
                    var parseData = new ParseData(facebookData, Date.now());
                    return parseData.makeConnections().then(() => {
                        var domElement = parseData.analizeDomElement(dom);
                        var outputElement = parseData.analizeDomElement(output);
                        return [domElement, outputElement];
                    })
                })
        })
        .then((arrayOutput) => {
            var newDom = arrayOutput[0];
            var newOutputDom = arrayOutput[1];
            var fileNameData = Date.now();
            var fileName = "image" + fileNameData + ".png";
            var childArgs = [
                path.join(__dirname, '../../../makeImage.js'),
                newDom,
                fileName
            ]
            childProcess.execFile(binPath, childArgs, (err, stdout, stderr) => {
                var data = fs.readFileSync(fileName);
                var stream = {
                    Bucket: process.env.QUIZ_IMAGE,
                    Key: fileName,
                    ACL: 'public-read',
                    Body: data,
                    ContentType: 'image/png'
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
                        var transactionData = { _id: fileNameData, imageName: fileName, questionID: questionID, outputText: newOutputDom, facebookID: userID };
                        var transaction = new Transaction(transactionData);
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