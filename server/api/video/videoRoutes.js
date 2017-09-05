import { Router } from "express";
import controller from './videoController';

export default () => {
    let router = Router();
    router.param("id", controller.params);

    router.route("/")
        .get(controller.get)
        .post(controller.post)

    router.route("/:id")
        .get(controller.getOne)
        .post(controller.postOne)
        .put(controller.putOne)
        .delete(controller.deleteOne)

    return router
}