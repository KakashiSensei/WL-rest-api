var router = require('express').Router();
var controller = require('./videoController');

router.param("id", controller.params);

router.route("/")
    .get(controller.get)
    .post(controller.post)

router.route("/:id")
    .get(controller.getOne)
    .post(controller.postOne)
    .put(controller.putOne)
    .delete(controller.deleteOne)

module.exports = router;