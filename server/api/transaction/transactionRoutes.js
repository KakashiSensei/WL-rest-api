import express from "express";
const router = express.Router();
import controller from './transactionController';

router.param("id", controller.params);

router.route("/:id")
    .get(controller.getTransaction);

export default router;