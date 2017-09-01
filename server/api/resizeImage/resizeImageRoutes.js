import express from "express";
const router = express.Router();
import controller from './resizeImageController';

router.route("/")
    .post(controller.resizeImage);

export default router;