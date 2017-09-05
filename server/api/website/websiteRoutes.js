import { Router } from "express";
import controller from './websiteController';

export default () => {
    let router = Router();
    router.route("/game")
        .get(controller.getGames)

    router.route("/video")
        .get(controller.getVideos)

    router.route("/game/:id")
        .get(controller.getOneGame)

    return router;
}