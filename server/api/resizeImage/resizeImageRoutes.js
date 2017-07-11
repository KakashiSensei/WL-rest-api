var router = require('express').Router();
var controller = require('./resizeImageController');

router.route("/")
    .post(controller.resizeImage);

module.exports = router;