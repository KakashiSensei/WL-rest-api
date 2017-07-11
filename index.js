var config = require('dotenv').config();
var app = require('./dist');
var logger = require('./dist/util/logger');

app.listen(process.env.PORT);
logger.log('listening on http://localhost:' + process.env.PORT);