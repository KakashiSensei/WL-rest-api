import Game from "../game/gameModel";
import Video from "../video/videoModel";

exports.getGames = function (req, res, next) {
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

exports.getVideos = function (req, res, next) {
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

exports.getOneGame = (req, res, next) => {
    console.log(req.params.id)
    Game.findById(req.params.id)
    .then((game) => {
        if (!game) {
            next(new Error("No game with id", id));
        } else {
            res.json(game);
        }
    }, (err) => {
        next(err);
    })
}