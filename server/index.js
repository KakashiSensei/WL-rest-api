var express = require('express');
var app = express();
var api = require('./api');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

// adding middleware
require('./middleware/appMiddleware')(app);

// defining routes
app.use('/api', api);

// defining error routes

module.exports = app;