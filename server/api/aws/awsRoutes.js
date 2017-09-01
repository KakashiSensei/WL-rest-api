import express from "express";
const router = express.Router();
import controller from "./awsController";

router.route("/")
    .get(controller.get)

export default router;