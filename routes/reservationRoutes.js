const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservationController");

const check = require("../authorization/auth");

router.post("/", check.auth, ReservationController.create);
router.get("/myObjectsDate", check.auth, ReservationController.myReservationsByDate);
router.get("/getAllDate", ReservationController.getAllReservationsByDate);
router.get("/getAllHoursSpacesDate", ReservationController.getReservationHoursAndSpacesByDate);
router.get("/getByClassPackage", ReservationController.getByClassPackageId);
router.put("/", ReservationController.editReservation);
router.delete("/", ReservationController.deleteById);

module.exports = router;