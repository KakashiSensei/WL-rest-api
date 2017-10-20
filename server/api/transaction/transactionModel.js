import mongoose from "mongoose";
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({
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

export default  mongoose.model("transactions", TransactionSchema);