import Account from './accountModel';

exports.addAccountInformation = (req, res, next) => {
    let body = req.body;
    Account.findOneAndUpdate({ email: req.body.email }, req.body, { upsert: true })
        .then((success, err) => {
            if (err) return res.send(500, { error: err });
            return res.json(success);
        });
}

exports.getAccountInformation = (req, res, next) => {

}