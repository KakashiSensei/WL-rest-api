var mongoose = require("mongoose");
var Schema = mongoose.Schema;

let status = {
    IN_REVIEW: "In Review",
    APPROVED: "Approved",
    POSTED: "Posted"
}

var GameSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    introImage: {
        type: String,
        required: true
    },
    outputText: {
        type: String,
        required: true
    },
    dom: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: status.IN_REVIEW
    },
    createdBy: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("games", GameSchema);