var router = require('express').Router();
var controller = require('./websiteController');

router.route("/game")
    .get(controller.getGames)

router.route("/video")
    .get(controller.getVideos)

router.route("/game/:id")
    .get(controller.getOneGame)

module.exports = router;