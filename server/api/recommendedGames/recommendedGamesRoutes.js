import { Router } from "express";
import controller from './recommendedGameController';

export default () => {
    let router = Router();
    router.param("id", controller.params);

    router.route("/:id")
        .get(controller.getOne);

    return router;
}