import EditableQuote from "./editableQuoteModel";
import childProcess from 'child_process';
import phantomjs from 'phantomjs-prebuilt';
import path from 'path';
import AWS from 'aws-sdk';
import fs from 'fs';
let binPath = process.env.NODE_ENV !== 'production' ? path.join(__dirname, "../../../node_modules/phantomjs-prebuilt/bin/phantomjs") : "phantomjs";

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_HOSTED_REGION
});

let s3Bucket = new AWS.S3();

exports.params = function (req, res, next, id) {
    EditableQuote.findById(id)
        .then((editableQuote) => {
            if (!editableQuote) {
                next();
            } else {
                req.editableQuote = editableQuote;
                next();
            }
        }, (err) => {
            next(err);
        })
}

exports.makeImage = (req, res, next) => {
    let body = req.body;
    let dom = body.dom;

    console.log("dom", dom);

    let fileNameData = Date.now();
    let fileName = "quote" + fileNameData + ".jpg";
    let childArgs = [
        path.join(__dirname, '../../../makeImage.js'),
        dom,
        fileName
    ]
    childProcess.execFile(binPath, childArgs, (err, stdout, stderr) => {
        console.log("Inside python response");
        let data = fs.readFileSync(fileName);
        let stream = {
            Bucket: process.env.QUIZ_IMAGE,
            Key: fileName,
            ACL: 'public-read',
            Body: data,
            ContentType: 'image/jpg'
        };
        s3Bucket.upload(stream, (err, data) => {
            console.log("Image uploaded to s3");
            if (err) {
                console.log(err);
                console.log('Error uploading data: ', data);
                next(err);
            } else {
                fs.unlink(fileName);
                res.json(data);
            }
        })
    })
}