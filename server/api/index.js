let router = require('express').Router();
let gameRoutes = require('./game/gameRoutes');
let facebookRoutes = require('./facebook/facebookRoutes');
let awsRoutes = require('./aws/awsRoutes');
let recommendedRoutes = require("./recommendedGames/recommendedGamesRoutes");
let resizeImage = require("./resizeImage/resizeImageRoutes");
let transaction = require("./transaction/transactionRoutes");
let video = require("./video/videoRoutes");

router.use('/game', gameRoutes);
router.use('/facebook', facebookRoutes);
router.use('/aws', awsRoutes);
router.use('/recommendedGames', recommendedRoutes);
router.use('/resizeImage', resizeImage);
router.use('/transaction', transaction);
router.use('/video', video);

module.exports = router;