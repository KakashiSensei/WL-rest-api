import express from "express";
const router = express.Router();
const privateRouter = express.Router();
import gameRoutes from './game/gameRoutes';
import facebookRoutes from './facebook/facebookRoutes';
import awsRoutes from './aws/awsRoutes';
import recommendedRoutes from "./recommendedGames/recommendedGamesRoutes";
import resizeImage from "./resizeImage/resizeImageRoutes";
import transaction from "./transaction/transactionRoutes";
import video from "./video/videoRoutes";
import account from "./account/accountRoutes";
import website from "./website/websiteRoutes";
import status from "./status/statusRoutes";
import postImage from "./postImage/postImageRoutes";

privateRouter.use('/game', gameRoutes());
privateRouter.use('/facebook', facebookRoutes());
privateRouter.use('/aws', awsRoutes());
privateRouter.use('/recommendedGames', recommendedRoutes());
privateRouter.use('/resizeImage', resizeImage());
privateRouter.use('/transaction', transaction());
privateRouter.use('/video', video());
privateRouter.use('/status', status());
privateRouter.use('/postImage', postImage());
router.use('/account', account());
router.use('/website', website());

exports.router = router;
exports.privateRouter = privateRouter;