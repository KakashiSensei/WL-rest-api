import tinify from 'tinify';
import sizeOf from 'image-size';
import gm from 'gm';
const imageMagick = gm.subClass({ imageMagick: true });

exports.resizeImage = function (req, res, next) {
    tinify.key = process.env.TINY_PNG_API_KEY;
    let url = req.body.url;
    let width = req.body.width;
    let height = req.body.height;

    let data = req.body.data;
    let type = req.body.type;
    let maxWidth = req.body.maxWidth;
    let maxHeight = req.body.maxHeight;

    if (url && width && height) {
        let http = url.charAt(4) == 's' ? require("https") : require("http");
        http.get(req.body.url, (result) => {
            if (result.statusCode !== 200) {
                throw 'statusCode returned: ' + result.statusCode;
            } else {
                let data = new Array;
                let dataLen = 0;

                result.on("data", (chunk) => {
                    data.push(chunk);
                    dataLen += chunk.length;
                });

                result.on("end", () => {
                    let buf = new Buffer(dataLen);
                    for (let i = 0, len = data.length, pos = 0; i < len; i++) {
                        data[i].copy(buf, pos);
                        pos += data[i].length;
                    }
                    gm(buf)
                        .toBuffer('JPG',(err, buffer) => {
                            if (err) return next(err);
                            let source = tinify.fromBuffer(buffer);
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
                        })
                });
            }
        })
    } else if (data && maxWidth && maxHeight) {
        maxWidth = +maxWidth.replace("px", "");
        maxHeight = +maxHeight.replace("px", "");
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