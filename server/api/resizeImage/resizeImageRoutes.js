import { Router } from "express";
import controller from './resizeImageController';

export default () => {
    let router = Router();
    router.route("/")
        .post(controller.resizeImage);
    return router;
}