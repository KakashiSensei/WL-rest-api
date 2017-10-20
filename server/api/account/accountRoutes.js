import { Router } from 'express';
import controller from "./accountController";

export default () => {
    let router = Router();
    router.route("/")
        .post(controller.addAccountInformation)

    return router;
}