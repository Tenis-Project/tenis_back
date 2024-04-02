const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    lastName: {
        type: String
    },
    role: {
        type: String,
        default: "Usuario"
    }
});

module.exports = model("User", UserSchema, "users");