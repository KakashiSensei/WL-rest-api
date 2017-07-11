var router = require("express").Router();
var controller = require("./facebookController");

router.param("id", controller.params);

router.route("/:id")
    .get(controller.getOne)

router.route("/")
    .post(controller.post)
    .get(controller.get)

module.exports = router;