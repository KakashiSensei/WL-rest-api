import Video from "./videoModel";

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
    let objectFilter = filterObject(req.user);
    let perPage = req.query.pp;
    let pageNumber = req.query.pn;
    if (perPage && pageNumber) {
        perPage = +perPage;
        pageNumber = +pageNumber - 1;
        Video.count(objectFilter, (err, count) => {
            Video.find(objectFilter).skip(pageNumber * perPage).limit(perPage)
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
        Video.find(objectFilter)
            .then((videos) => {
                res.json(videos);
            }, (err) => {
                next(err);
            })
    }

}

exports.post = function (req, res, next) {
    let body = req.body;
    body.createdBy = req.user.email;
    let newVideo = new Video(body);
    newVideo.save((err, newVideo) => {
        if (err) {
            next(err);
        } else {
            res.json(newVideo);
        }
    })
}

exports.getOne = function (req, res, next) {
    let video = req.video;
    res.json(video);
}

exports.putOne = function (req, res, next) {
    let objectFilter = filterObject(req.user);
    objectFilter._id = req.video.id;
    Video.findOneAndUpdate(objectFilter, req.body, { upsert: true })
        .then((success, err) => {
            if (err) return res.send(500, { error: err });
            return res.json(success);
        });
}

exports.deleteOne = function (req, res, next) {
    let objectFilter = filterObject(req.user);
    objectFilter._id = req.video.id;
    let deleted = Video.find(objectFilter).remove().exec();
    res.json(deleted);
}

exports.postOne = function (req, res, next) {

}