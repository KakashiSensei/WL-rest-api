var Game = require("../game/gameModel");

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
    Game.find({ _id: { $ne: req.game._id } })
        .then((data) => {
            return res.json(data);
        })
}