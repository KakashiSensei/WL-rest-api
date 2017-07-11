var router = require("express").Router();
var controller = require("./quizImageController");

router.route('/:id')
    .get()