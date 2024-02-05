const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservationController");

const check = require("../authorization/auth");

router.post("/", check.auth, ReservationController.create);
router.get("/myObjectsDate", check.auth, ReservationController.myReservationsByDate);
router.get("/getAllDate", ReservationController.getAllReservationsByDate);
router.get("/getAllHoursDate", ReservationController.getReservationHoursByDate);

module.exports = router;