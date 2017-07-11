const aws = require('aws-sdk');
aws.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_HOSTED_REGION
});

aws.config.update({region: 'us-west-2'})

exports.get = function (req, res, next) {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: 'whitelight-questions',
        Key: fileName,
        Expires: 60 * 20,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: "https://" + s3Params.Bucket + ".s3.amazonaws.com/" + fileName
        };
        res.json(returnData);
    });
}