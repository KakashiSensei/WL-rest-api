import Account from './accountModel';

exports.addAccountInformation = (req, res, next) => {
    let body = req.body;
    console.log("inisde addAccountInformation")
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
                console.log(account[0]);
                res.json(account[0]);
            }
        })
}

exports.getAccountInformation = (req, res, next) => {

}