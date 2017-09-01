import express from "express";
const router = express.Router();
import controller from "./facebookController";

router.param("id", controller.params);

router.route("/:id")
    .get(controller.getOne)

router.route("/")
    .post(controller.post)
    .get(controller.get)

export default router;