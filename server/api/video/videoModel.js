let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let status = {
    IN_REVIEW: "In Review",
    APPROVED: "Approved",
    POSTED: "Posted"
}

let VideoSchema = new Schema({
    videoID: {
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

module.exports = mongoose.model('videos', VideoSchema);