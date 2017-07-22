import tinify from 'tinify';
import sizeOf from 'image-size';

exports.resizeImage = function (req, res, next) {
    tinify.key = process.env.TINY_PNG_API_KEY;
    let url = req.body.url;
    let width = req.body.width;
    let height = req.body.height;

    let data = req.body.data;
    let type = req.body.type;
    let maxWidth = +req.body.maxWidth.replace("px", "");
    let maxHeight = +req.body.maxHeight.replace("px", "");

    if (url && width && height) {
        let source = tinify.fromUrl(req.body.url);
        let resized = source.resize({
            method: "cover",
            width: width,
            height: height
        });
        resized.store({
            service: "s3",
            aws_access_key_id: process.env.S3_ACCESS_KEY,
            aws_secret_access_key: process.env.S3_SECRET_KEY,
            region: process.env.S3_HOSTED_REGION,
            path: `${process.env.QUESTION_IMAGE}/introImage${Date.now()}.jpg`
        }).meta().then((meta) => {
            res.json(meta);
        })
    } else if (data && maxWidth && maxHeight) {
        let bufferData = new Buffer(req.body.data, 'base64');
        let source = tinify.fromBuffer(bufferData);
        let dimension = sizeOf(bufferData);
        let sourceWidth = dimension.width;
        let sourceHeight = dimension.height;
        let sourceRatio = sourceWidth / sourceHeight;
        let maxRatio = maxWidth / maxHeight;

        if (sourceWidth > maxWidth || sourceHeight > maxHeight) {
            if (sourceRatio > maxRatio) {
                source = source.resize({
                    method: "scale",
                    height: maxHeight
                });
            } else {
                source = source.resize({
                    method: "scale",
                    width: maxWidth
                });
            }
        }
        source.store({
            service: "s3",
            aws_access_key_id: process.env.S3_ACCESS_KEY,
            aws_secret_access_key: process.env.S3_SECRET_KEY,
            region: process.env.S3_HOSTED_REGION,
            path: `${process.env.QUESTION_IMAGE}/questionImage${Date.now()}.${type}`
        }).meta().then((meta) => {
            res.json(meta);
        })
    }
}