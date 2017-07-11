var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    questionID: {
        type: String,
        required: true
    },
    outputText: {
        type: String,
        required: true
    },
    facebookID: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("transactions", TransactionSchema);