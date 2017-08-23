var Video = require("./videoModel");
var Promise = require('bluebird');
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

exports.params = function (req, res, next, id) {
    Video.findById(id)
        .then((video) => {
            if (!video) {
                next(new Error("No video with id", id));
            } else {
                req.video = video;
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
        Video.count({}, (err, count) => {
            Video.find({}).skip(pageNumber * perPage).limit(perPage)
                .then((videos) => {
                    let data = {};
                    data.items = videos;
                    data.count = count;
                    res.json(data);
                }, function (err) {
                    next(err);
                })
        });
    } else {
        Video.find({})
            .then((videos) => {
                res.json(videos);
            }, (err) => {
                next(err);
            })
    }

}

exports.post = function (req, res, next) {
    var body = req.body;

    var newVideo = new Video(body);
    newVideo.save((err, newVideo) => {
        if (err) {
            next(err);
        } else {
            res.json(newVideo);
        }
    })
}

exports.getOne = function (req, res, next) {
    var video = req.video;
    res.json(video);
}

exports.putOne = function (req, res, next) {
    // var object = Video.findById(req.id);
    Video.findOneAndUpdate({ _id: req.video.id }, req.body, { upsert: true })
        .then((success, err) => {
            if (err) return res.send(500, { error: err });
            return res.json(success);
        });
}

exports.deleteOne = function (req, res, next) {
    var deleted = Video.find({ _id: req.video.id }).remove().exec();
    res.json(deleted);
}

exports.postOne = function (req, res, next) {

}