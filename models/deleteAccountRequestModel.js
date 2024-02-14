const { Schema, model } = require("mongoose");

const DeleteAccountRequestSchema = Schema({
    username: {
        type: String
    }
});

module.exports = model("DeleteAccountRequest", DeleteAccountRequestSchema, "deleteAccountRequests");