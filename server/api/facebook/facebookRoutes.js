import { Router } from "express";
import controller from "./facebookController";

export default () => {
    let router = Router();
    router.param("id", controller.params);

    router.route("/:id")
        .get(controller.getOne)

    router.route("/")
        .post(controller.post)
        .get(controller.get)

    return router;
}