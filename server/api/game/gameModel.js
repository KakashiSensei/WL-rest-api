import mongoose from "mongoose";
const Schema = mongoose.Schema;
import {status} from "../../util/constants";

let GameSchema = new Schema({
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
        default: status.DEVELOPING
    },
    createdBy: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

export default mongoose.model("games", GameSchema);