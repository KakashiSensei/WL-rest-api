import tinify from 'tinify';
import sizeOf from 'image-size';
import gm from 'gm';
const imageMagick = gm.subClass({ imageMagick: true });
import nodeUrl from 'url';

exports.resizeImage = function (req, res, next) {
    tinify.key = process.env.TINY_PNG_API_KEY;

    let url = req.body.url;
    let width = req.body.width;
    let height = req.body.height;

    let data = req.body.data;
    let type = req.body.type;
    let maxWidth = req.body.maxWidth;
    let maxHeight = req.body.maxHeight;
    let facebookPost = req.body.facebookPost;

    if (width && height) {
        width = +width.replace("px", "");
        height = +height.replace("px", "");
        if (url) {
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
                        fixedSizeImage(buf, width, height, res);
                    });
                }
            })
        } else if (data) {
            let bufferData = new Buffer(data, 'base64');
            fixedSizeImage(bufferData, width, height, res);
        }
    } else if (maxWidth && maxHeight) {
        maxWidth = +maxWidth.replace("px", "");
        maxHeight = +maxHeight.replace("px", "");
        let source;
        let dimension;
        if (data) {
            let bufferData = new Buffer(data, 'base64');
            source = tinify.fromBuffer(bufferData);
            dimension = sizeOf(bufferData);
            uploadImage(dimension, source, maxWidth, maxHeight, type, res);
        } else if (url) {
            let http = url.charAt(4) == 's' ? require("https") : require("http");
            let options = nodeUrl.parse(url);
            http.get(options, (response) => {
                let chunks = [];
                response.on('data', function (chunk) {
                    chunks.push(chunk);
                }).on('end', function () {
                    let bufferData = Buffer.concat(chunks);
                    source = tinify.fromBuffer(bufferData);
                    dimension = sizeOf(bufferData);
                    uploadImage(dimension, source, maxWidth, maxHeight, type, res);
                });
            });
        }
    } else if (facebookPost) {
        let bufferData = new Buffer(data, 'base64');
        let source = tinify.fromBuffer(bufferData);
        source.store({
            service: "s3",
            aws_access_key_id: process.env.S3_ACCESS_KEY,
            aws_secret_access_key: process.env.S3_SECRET_KEY,
            region: process.env.S3_HOSTED_REGION,
            path: `${process.env.POST_IMAGE}/postImage${Date.now()}.png`
        }).meta().then((meta) => {
            res.json(meta);
        })
    }
}

let fixedSizeImage = function (buf, width, height, res) {
    gm(buf)
        .toBuffer('jpeg', (err, buffer) => {
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
}

let uploadImage = function (dimension, source, maxWidth, maxHeight, type, res) {
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