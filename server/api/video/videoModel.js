let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let VideoSchema = new Schema({
    videoID: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('videos', VideoSchema);