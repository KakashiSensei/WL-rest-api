import Transaction from "./transactionModel";

exports.params = function (req, res, next, id) {
    Transaction.findById(id)
        .then((transaction) => {
            if (!transaction) {
                next(new Error("No transaction with id", id));
            } else {
                req.transaction = transaction;
                next();
            }
        }, (err) => {
            next(err);
        })
}

exports.getTransaction = function (req, res, next) {
    let transaction = req.transaction;
    res.json(transaction);
}