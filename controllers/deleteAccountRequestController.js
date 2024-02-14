const DeleteAccountRequest = require("../models/deleteAccountRequestModel");

const create = async (req, res) => {
    let body = req.body;

    if (!body.username) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let bodyDeleteAccountRequest = {
        username: body.username,
    }

    let deleteAccountRequest_to_save = new DeleteAccountRequest(bodyDeleteAccountRequest);

    try {
        const deleteAccountRequestStored = await deleteAccountRequest_to_save.save();

        if (!deleteAccountRequestStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No request saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Request registered",
            "deleteAccountRequest": deleteAccountRequestStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving request",
            error
        });
    }
}

module.exports = {
    create
}