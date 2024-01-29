const express = require("express");
const router = express.Router();
const ClassController = require("../controllers/classController");

router.post("/", ClassController.create);
router.get("/list", ClassController.list);

module.exports = router;