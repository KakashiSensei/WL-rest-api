var router = require('express').Router();
var gameRoutes = require('./game/gameRoutes');
var facebookRoutes = require('./facebook/facebookRoutes');
var awsRoutes = require('./aws/awsRoutes');
var recommendedRoutes = require("./recommendedGames/recommendedGamesRoutes");
var resizeImage = require("./resizeImage/resizeImageRoutes");
var transaction = require("./transaction/transactionRoutes");

router.use('/game', gameRoutes);
router.use('/facebook', facebookRoutes);
router.use('/aws', awsRoutes);
router.use('/recommendedGames', recommendedRoutes);
router.use('/resizeImage', resizeImage);
router.use('/transaction', transaction);

module.exports = router;