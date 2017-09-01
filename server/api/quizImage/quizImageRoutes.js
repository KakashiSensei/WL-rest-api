import express from "express";
const router = express.Router();
import controller from "./quizImageController";

router.route('/:id')
    .get()