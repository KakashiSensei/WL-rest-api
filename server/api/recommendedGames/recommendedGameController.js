import Game from "../game/gameModel";

exports.params = function (req, res, next, id) {
    Game.findById(id)
        .then((game) => {
            if (game) {
                req.game = game;
            }
            return next();
        })
        .catch(() => {
            return next(new Error(`No game with id ${id}`));
        })
}

exports.getOne = function (req, res, next) {
    let num = +req.query.num;
    Game.count({}, (err, count) => {
        let skip = Math.floor((count - 1) / num) - 1;
        Game.find({ _id: { $ne: req.game._id } }).skip(skip * num).limit(num)
            .then((data) => {
                res.json(data);
            }, function (err) {
                next(err);
            })
    });
}