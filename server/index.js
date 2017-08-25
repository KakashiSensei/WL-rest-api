import express from 'express';
var app = express();
import * as api from "./api";
import mongoose from 'mongoose';
import "isomorphic-fetch";
import Account from "./api/account/accountModel";

mongoose.connect(process.env.MONGODB_URI);

// adding middleware
require('./middleware/appMiddleware')(app);

// defining error routes
let addFacebookDetail = (req, res, next) => {
    let accessToken = req.token;
    let aboutMeURL = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;
    fetch(aboutMeURL, { method: "GET" })
        .then(res => res.json())
        .then((data) => {
            Account.find({ email: data.email })
                .then((userDetail) => {
                    if (userDetail) {
                        if(userDetail.length > 1){
                            next(new Error("Multiple user with same email address"));
                        }
                        req.user = userDetail[0];
                        next();
                    }else{
                        next(new Error("Not authorised to login"));
                    }
                })
        })
        .catch((err) => {
            next(new Error("Not authorised to login"));
        })


}

// defining routes
app.use('/api', api.router);
app.use('/api', addFacebookDetail, api.privateRouter);



module.exports = app;