import Game from '../game/gameModel';

exports.post = (req, res, next) => {
    let status = req.body.status;
    let questionID = req.body.id;
    Game.findById(questionID)
        .then((game) => {
            game.status = status;
            Game.findOneAndUpdate({ _id: questionID }, game, { upsert: true })
                .then((game) => {
                    res.json(game);
                })
        })
}