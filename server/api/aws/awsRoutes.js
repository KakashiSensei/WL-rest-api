import { Router } from "express";
import controller from "./awsController";

export default () => {
    let router = Router();
    router.route("/")
        .get(controller.get)
    return router;
}