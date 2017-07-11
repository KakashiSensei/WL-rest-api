var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FacebookSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    aboutMe: {
        type: Object
    },
    photos: {
        type: Object
    },
    friends: {
        type: Object
    }
}, {
        timestamps: true
    })

module.exports = mongoose.model("facebookDatas", FacebookSchema);