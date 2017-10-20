import mongoose from "mongoose";
const Schema = mongoose.Schema;

let TYPE = {
    DEVELOPER: "developer",
    ADMIN: "admin"
}

let AccountSchema = new Schema({
    email: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true,
        default: TYPE.DEVELOPER
    },

    facebookID: {
        tyoe: String
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model("accountData", AccountSchema);