let router = require('express').Router();
let privateRouter = require('express').Router();
let gameRoutes = require('./game/gameRoutes');
let facebookRoutes = require('./facebook/facebookRoutes');
let awsRoutes = require('./aws/awsRoutes');
let recommendedRoutes = require("./recommendedGames/recommendedGamesRoutes");
let resizeImage = require("./resizeImage/resizeImageRoutes");
let transaction = require("./transaction/transactionRoutes");
let video = require("./video/videoRoutes");
let account = require("./account/accountRoutes");

privateRouter.use('/game', gameRoutes);
privateRouter.use('/facebook', facebookRoutes);
privateRouter.use('/aws', awsRoutes);
privateRouter.use('/recommendedGames', recommendedRoutes);
privateRouter.use('/resizeImage', resizeImage);
privateRouter.use('/transaction', transaction);
privateRouter.use('/video', video);
router.use('/account', account);

exports.router = router;
exports.privateRouter = privateRouter;