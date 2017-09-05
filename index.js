var config = require('dotenv').config();
var app = require('./dist');
var logger = require('./dist/util/logger').default;
global.Promise = require('bluebird')
require('isomorphic-fetch');
// require('newrelic');
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');


app.listen(process.env.PORT);
logger.log('listening on http://localhost:' + process.env.PORT);