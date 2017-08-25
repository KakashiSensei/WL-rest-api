var FacebookData = require("../facebook/facebookModel");
var Game = require("../game/gameModel");

exports.get = function (req, res, next) {
    let questionID = req.param('id');
    let userID = req.param('userID');
    let accessToken = req.param('accessToken');

    if (userID && accessToken && questionID) {
        let promise1 = FacebookData.findById(userID);
        let promise2 = Game.findById(questionID);
        Promise.all([promise1, promise2])
            .then((resultArray) => {

            })
    } else {
        next(new Error("userID and accessToken not provided"));
    }
}