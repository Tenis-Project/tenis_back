const express = require("express");
const router = express.Router();
const ClassPackageController = require("../controllers/classPackageController");

const check = require("../authorization/auth");

router.post("/", check.auth, ClassPackageController.create);
router.get("/myObjects", check.auth, ClassPackageController.myClassPackages);
router.get("/getAllStandBy", ClassPackageController.getAllStandByClassPackages);
router.put("/", ClassPackageController.editClassPackage);
router.delete("/", ClassPackageController.deleteById);

module.exports = router;