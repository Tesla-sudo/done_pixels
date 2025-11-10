//models/User.js
const mongoose = require("mongoose");
const { patch } = require("../routes/auth");

//Define the User schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },

    passwordResetToken: {
        type: String
    },
    passwordResetExpires:{
        type: Date
    }
}, {timestamps: true});

//Create and export the User model
module.exports = mongoose.model("User", UserSchema);