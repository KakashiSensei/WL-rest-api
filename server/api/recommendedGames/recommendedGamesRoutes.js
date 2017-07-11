var router = require('express').Router();
var controller = require('./recommendedGameController');

router.param("id", controller.params);

router.route("/:id")
.get(controller.getOne);

module.exports = router;