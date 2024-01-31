const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservationController");

const check = require("../authorization/auth");

router.post("/", check.auth, ReservationController.create);
router.get("/myObjects", check.auth, ReservationController.myReservations);

module.exports = router;