var AWS = require('aws-sdk');
var Jimp = require("jimp");

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_HOSTED_REGION
});

var s3Bucket = new AWS.S3();

exports.resizeImage = function (req, res, next) {
    console.log("Inisde sharp", req.body);
    Jimp.read(req.body.url)
        .then(function (image) {
            image.resize(300, 200)
                .getBuffer(Jimp.MIME_PNG, function (err, buffer) {
                    var stream = {
                        Bucket: "whitelight-questions",
                        Key: `introImage${Date.now()}.png`,
                        ACL: 'public-read',
                        Body: buffer,
                    };
                    s3Bucket.upload(stream, (err, data) => {
                        console.log("Image uploaded to s3");
                        if (err) {
                            console.log(err);
                            console.log('Error uploading data: ', data);
                            next(err);
                        } else {
                            //delete local file
                            res.json(data);
                            console.log('succesfully uploaded the image!', data);
                        }
                    });
                })
        })
        .catch(function (err) {
            next(new Error("Image processing failed"));
        })
}