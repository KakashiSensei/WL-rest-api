import { Router } from "express";
import controller from "./statusController";

export default () => {
    let router = Router();
    router.route("/")
        .post(controller.post)
    return router;
}