var router = require("express").Router();
var controller = require("./awsController");

router.route("/")
    .get(controller.get)

module.exports = router;