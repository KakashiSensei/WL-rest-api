import express from "express";
const router = express.Router();
import controller from './videoController';

router.param("id", controller.params);

router.route("/")
    .get(controller.get)
    .post(controller.post)

router.route("/:id")
    .get(controller.getOne)
    .post(controller.postOne)
    .put(controller.putOne)
    .delete(controller.deleteOne)

export default router;