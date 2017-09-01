import mongoose from "mongoose";
const Schema = mongoose.Schema;

let FacebookSchema = new Schema({
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
    },
    feeds: {
        type: Object
    }
}, {
        timestamps: true
    })

export default mongoose.model("facebookDatas", FacebookSchema);