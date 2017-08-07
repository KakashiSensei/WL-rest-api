var FacebookData = require("./facebookModel");
var Promise = require("bluebird");
var fetch = require("isomorphic-fetch");
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

exports.params = function (req, res, next, id) {
    FacebookData.findById(id)
        .then((facebookData) => {
            if (!facebookData) {
                next();
            } else {
                req.facebookData = facebookData;
                next();
            }
        }, (err) => {
            next(err);
        })
}

exports.getOne = function (req, res, next) {
    let facebookData = req.facebookData;
    if (facebookData) {
        res.json(facebookData);
    } else {
        let id = req.params.id;
        let accessToken = req.query.accessToken;
        getFacebookData(id, accessToken)
            .then((data) => {
                let facebookData = new FacebookData({ _id: id, accessToken: accessToken, aboutMe: data[0], photos: data[1], friends: data[2] });
                facebookData.save();
                res.json();
            })
    }
}

exports.post = function (req, res, next) {
    let body = req.body;
    let id = body.id;
    let accessToken = body.accessToken;
    if (FacebookData.find({ _id: id })) {
        FacebookData.find({ _id: id }).remove()
            .then(() => {
                getFacebookData(id, accessToken)
                    .then((data) => {
                        insertFacebookData({ _id: id, accessToken: accessToken, aboutMe: data[0], photos: data[1], friends: data[2], feeds: data[3] }, res);
                    })
            })
    } else {
        getFacebookData(id, accessToken)
            .then((data) => {
                insertFacebookData({ _id: id, accessToken: accessToken, aboutMe: data[0], photos: data[1], friends: data[2], feeds: data[3] }, res);

            })
    }
}

exports.get = function (req, res, next) {
    FacebookData.find()
        .then((data) => {
            res.json(data);
        })
}

exports.updateFacebookData = function (id, accessToken) {
    return FacebookData.find({ _id: id }).remove()
        .then(() => {
            return getFacebookData(id, accessToken);
        })
        .then((data) => {
            return insertFacebookData({ _id: id, accessToken: accessToken, aboutMe: data[0], photos: data[1], friends: data[2], feeds: data[3] });
        })
}

let insertFacebookData = function (facebookObject, res) {
    let facebookData = new FacebookData(facebookObject);
    return facebookData.save()
        .then((data) => {
            if (res)
                res.json(data);
            return data;
        })
        .catch((err) => {
            if (res)
                res.send(err);
            return err;
        })
}

let getFacebookData = (facebookID, accessToken) => {
    let promiseArray = [];

    // get about me
    promiseArray.push(aboutMe(facebookID, accessToken));
    // get albums detail
    promiseArray.push(albumDetail(facebookID, accessToken));
    // get friend detail
    promiseArray.push(friendsDetail(facebookID, accessToken));
    // get feed detail
    promiseArray.push(feedData(facebookID, accessToken));

    return Promise.all(promiseArray);
}

let aboutMe = (facebookID, accessToken) => {
    return new Promise((resolve, reject) => {
        let aboutMeURL = "https://graph.facebook.com/me?fields=id,name,about,age_range,birthday,email,education,cover,hometown,gender,first_name,last_name,middle_name,relationship_status,languages&access_token=" + accessToken;
        fetch(aboutMeURL, { method: "GET" })
            .then(res => res.json())
            .then((data) => {
                return resolve(data);
            })
            .catch((err) => {
                return reject(err);
            })
    })
}

let albumDetail = (facebookID, accessToken) => {
    return new Promise((resolve, reject) => {
        let albumURL = "https://graph.facebook.com/me/albums?fields=photos.limit(5){id,images,comments.limit(5000),likes.limit(5000)},name,id&access_token=" + accessToken;
        fetch(albumURL, { method: "GET" })
            .then(res => res.json())
            .then((data) => {
                return resolve(data)
            })
            .catch((err) => {
                return reject(err);
            })
    })
}

let feedData = (facebookID, accessToken) => {
    return new Promise((resolve, reject) => {
        let feedURL = "https://graph.facebook.com/me/feed?fields=created_time,id,from,story_tags&limit=10&access_token=" + accessToken;
        fetch(feedURL, { method: "GET" })
            .then(res => res.json())
            .then((data) => {
                return resolve(data)
            })
            .catch((err) => {
                return reject(err);
            })
    })
}

let friendsDetail = (facebookID, accessToken) => {
    return new Promise((resolve, reject) => {
        let friendURL = "https://graph.facebook.com/me/friends?fields=first_name,birthday,cover,gender,hometown,last_name,name,relationship_status,family&access_token=" + accessToken;
        fetch(friendURL, { method: "GET" })
            .then(res => res.json())
            .then((data) => {
                return resolve(data)
            })
            .catch((err) => {
                return reject(err);
            })
    })
}