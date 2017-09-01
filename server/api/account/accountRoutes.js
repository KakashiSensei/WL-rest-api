import express from "express";
const router = express.Router();
import controller from "./accountController";

router.route("/")
    .post(controller.addAccountInformation)

export default router;