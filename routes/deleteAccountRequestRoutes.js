const express = require("express");
const router = express.Router();
const DeleteAccountRequestController = require("../controllers/deleteAccountRequestController");

router.post("/", DeleteAccountRequestController.create);

module.exports = router;