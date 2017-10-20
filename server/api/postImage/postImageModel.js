import mongoose from "mongoose";
const Schema = mongoose.Schema;
import * as constants from "../../util/constants";

let PostImageSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    photoID: {
        type: String
    },
    postID: {
        type: String
    },
    postTime: {
        type: Number
    },
    status: {
        type: String,
        required: true,
        default: constants.status.DEVELOPING
    }
},
    {
        timestamps: true
    })

export default mongoose.model("postImages", PostImageSchema);