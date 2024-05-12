const mongoose = require("mongoose")
const validator = require("validator")
const passportLocalMongoose = require("passport-local-mongoose")



const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        }
    })

    UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema)