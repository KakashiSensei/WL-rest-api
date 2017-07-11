var router = require('express').Router();
var controller = require('./transactionController');

router.param("id", controller.params);

router.route("/:id")
    .get(controller.getTransaction);

module.exports = router;