import express from "express";
const router = express.Router();
import controller from './recommendedGameController';

router.param("id", controller.params);

router.route("/:id")
.get(controller.getOne);

export default router;