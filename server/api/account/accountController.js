import Account from './accountModel';

exports.addAccountInformation = (req, res, next) => {
    let body = req.body;
    Account.find({ "email": body.email })
        .then((account) => {
            // console.log("New account", account);
            if (account.length === 0) {
                let account = new Account(body);
                account.save((err, account) => {
                    if (err) {
                        next(err);
                    } else {
                        res.json(account);
                    }
                })
            } else {
                res.json(account[0]);
            }
        })
}

exports.getAccountInformation = (req, res, next) => {

}