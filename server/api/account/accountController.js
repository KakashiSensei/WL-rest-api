import Account from './accountModel';

exports.addAccountInformation = (req, res, next) => {
    let body = req.body;
    Account.find(body.email)
        .then((account) => {
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
                res.json(body);
            }
        })
}

exports.getAccountInformation = (req, res, next) => {

}