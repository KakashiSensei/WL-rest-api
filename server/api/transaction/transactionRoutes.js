import { Router } from "express";
import controller from './transactionController';

export default () => {
    let router = Router();
    router.param("id", controller.params);

    router.route("/:id")
        .get(controller.getTransaction);

    return router;
}