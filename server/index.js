var express = require('express');
var app = express();
import * as api from "./api";
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

// adding middleware
require('./middleware/appMiddleware')(app);

// defining routes
app.use('/api', api.router);
app.use('/api', api.privateRouter);

// defining error routes

module.exports = app;