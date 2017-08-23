var router = require("express").Router();
var controller = require("./accountController");

router.route("/")
    .post(controller.addAccountInformation)

module.exports = router;