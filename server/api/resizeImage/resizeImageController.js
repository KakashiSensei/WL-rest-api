import tinify from 'tinify';

exports.resizeImage = function (req, res, next) {
    tinify.key = process.env.TINY_PNG_API_KEY;

    let source = tinify.fromUrl(req.body.url);
    let resized = source.resize({
        method: "cover",
        width: 300,
        height: 200
    });
    resized.store({
        service: "s3",
        aws_access_key_id: process.env.S3_ACCESS_KEY,
        aws_secret_access_key: process.env.S3_SECRET_KEY,
        region: process.env.S3_HOSTED_REGION,
        path: `${process.env.QUESTION_IMAGE}/introImage${Date.now()}.png`
    }).meta().then((meta) => {
        res.json(meta);
    })
}