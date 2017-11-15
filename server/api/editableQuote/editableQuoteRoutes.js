import { Router } from "express";
import controller from "./editableQuoteController";

export default () => {
    let router = Router();
    router.param("id", controller.params);

    router.route("/makeImage")
        .post(controller.makeImage)

    return router;
}