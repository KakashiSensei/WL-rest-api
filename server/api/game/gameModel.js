var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model("games", GameSchema);