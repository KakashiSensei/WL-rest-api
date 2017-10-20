import PostImage from "./postImageModel";
import { status } from "../../util/constants";

let filterObject = (userInfo) => {
    let filterObject = {};
    if (userInfo === undefined) {
        // console.log("Adding fake email address");
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
    PostImage.findById(id)
        .then((postImage) => {
            if (!postImage) {
                next(new Error("No postImage with id", id));
            } else {
                req.postImage = postImage;
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
        PostImage.count(objectFilter, (err, count) => {
            PostImage.find(objectFilter).skip(pageNumber * perPage).limit(perPage)
                .then((postImage) => {
                    let data = {};
                    data.items = postImage;
                    data.count = count;
                    res.json(data);
                }, function (err) {
                    next(err);
                })
        });
    } else {
        PostImage.find(objectFilter)
            .then((postImage) => {
                res.json(postImage);
            }, (err) => {
                next(err);
            })
    }
}

exports.post = function (req, res, next) {
    let body = req.body;
    let postImageObject = {};
    postImageObject.imageUrl = body.imageUrl;
    postImageObject.createdBy = req.user.email;

    let newPostImage = new PostImage(postImageObject);
    newPostImage.save((err, postImage) => {
        if (err) {
            next(err);
        } else {
            res.json(postImage);
        }
    })
}

exports.getOne = function (req, res, next) {
    let postImage = req.postImage;
    if (postImage.createdBy === req.user.email || req.user.type === "admin") {
        res.json(postImage);
    } else {
        next(new Error("Not Authorised to view"));
    }
}
exports.putOne = function (req, res, next) {
    let objectFilter = filterObject(req.user);
    objectFilter._id = req.postImage.id;
    PostImage.find(objectFilter)
        .then((postImage) => {
            let createdBy = postImage[0].createdBy;
            let toUpdateWith = req.body;
            toUpdateWith.createdBy = createdBy || req.user.email;
            toUpdateWith.status = status.DEVELOPING;
            PostImage.findOneAndUpdate(objectFilter, toUpdateWith, { upsert: true })
                .then((success, err) => {
                    if (err) return res.send(500, { error: err });
                    return res.json(success);
                });
        })
}

exports.getLastTime = function (req, res, next) {
    let objectFilter = filterObject(req.user);
    PostImage.findOne(objectFilter)
        .sort({"postTime": -1})
        .exec((err, doc) => {
            console.log(doc);
            res.json(doc);
        })
}

exports.deleteOne = function (req, res, next) {
    let objectFilter = filterObject(req.user);
    objectFilter._id = req.postImage.id;
    let deleted = PostImage.find(objectFilter).remove().exec();
    res.json(deleted);
}