import Game from '../game/gameModel';
import PostImage from '../postImage/postImageModel';

exports.post = (req, res, next) => {
    let status = req.body.status;
    let photoID = req.body.photoID;
    let postID = req.body.postID;
    let postTime = req.body.postTime;
    let elementID = req.body.id;
    let type = req.body.type;
    console.log("Inside Changing status");
    if (type === "game") {
        Game.findById(elementID)
            .then((element) => {
                element.status = status;
                Game.findOneAndUpdate({ _id: elementID }, element, { upsert: true })
                    .then((element) => {
                        res.json(element);
                    })
            })
    } else if (type === "postImage") {
        PostImage.findById(elementID)
        .then((element) => {
            element.status = status;
            element.postID = postID;
            element.photoID = photoID;
            element.postTime = postTime;
            PostImage.findOneAndUpdate({ _id: elementID }, element, { upsert: true })
                .then((element) => {
                    res.json(element);
                })
        })
    }
}