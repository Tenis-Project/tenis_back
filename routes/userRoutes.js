const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

const check = require("../authorization/auth");

router.post("/register", UserController.register);
router.post("/login", UserController.loginUser)
router.get("/myObject", check.auth, UserController.myObject);

module.exports = router;