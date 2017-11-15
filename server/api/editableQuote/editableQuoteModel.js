import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { status } from "../../util/constants";

let EditableQuoteSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    quoteText: {
        type: String,
        required: true
    },
    quoteAuthor: {
        type: String,
        required: true,
    },
    quoteType: {
        type: String,
        required: true
    },
    template: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        required: true,
        default: status.DEVELOPING
    },
    createdBy: {
        type: String,
        required: true,
    }
}, {
        timestamps: true
    })

export default mongoose.model("editableImages", EditableQuoteSchema);