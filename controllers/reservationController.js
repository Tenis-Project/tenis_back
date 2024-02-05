const Reservation = require("../models/reservationModel");

const create = async (req, res) => {
    let body = req.body;

    if (!body.hour || !body.date || !body.class) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let bodyReservation = {
        date: body.date,
        hour: body.hour,
        user: req.user.id,
        class: body.class,
    }

    let reservation_to_save = new Reservation(bodyReservation);

    try {
        let reservations = await Reservation.find({hour: bodyReservation.hour});
        let today = new Date(bodyReservation.date).setHours(0,0,0,0);
        reservations = reservations.filter(reservation => {
            return new Date(reservation.date).setHours(0,0,0,0) == today
        });

        if (reservations && reservations.length >= 4) {
            return res.status(404).json({
                "status": "error",
                "message": "Fecha y hora ya reservadas"
            });
        }

        const reservationStored = await reservation_to_save.save();

        if (!reservationStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No reservation saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Reservation registered",
            "reservation": reservationStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving reservation",
            error
        });
    }
}

const myReservationsByDate = async (req, res) => {
    let date = req.query.date;
    let today = new Date(date).setHours(0,0,0,0);

    Reservation.find({ user: req.user.id }).populate('user class').sort('hour').then(reservations => {
        reservations = reservations.filter(reservation => {
            return new Date(reservation.date).setHours(0,0,0,0) == today
        });

        if (reservations.length == 0) {
            return res.status(404).json({
                status: "error",
                message: "Reservaciones no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            reservations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getAllReservationsByDate = async (req, res) => {
    let date = req.query.date;
    let today = new Date(date).setHours(0,0,0,0);

    Reservation.find().populate('user class').sort('hour').then(reservations => {
        reservations = reservations.filter(reservation => {
            return new Date(reservation.date).setHours(0,0,0,0) == today
        });

        if (reservations.length == 0) {
            return res.status(404).json({
                status: "error",
                message: "Reservaciones no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            reservations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getReservationHoursByDate = async (req, res) => {
    let date = req.query.date;
    let today = new Date(date).setHours(0,0,0,0);
    let reservationHours = [];

    Reservation.find().populate('user class').sort('hour').then(reservations => {
        reservations.forEach(reservation => {
            if (new Date(reservation.date).setHours(0,0,0,0) == today) {
                reservationHours.push(reservation.hour)
            }
        });

        let uniqueReservationHours = [...new Set(reservationHours)];

        console.log(uniqueReservationHours);

        if (reservationHours.length == 0) {
            return res.status(404).json({
                status: "error",
                message: "Reservaciones no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            uniqueReservationHours
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

module.exports = {
    create,
    myReservationsByDate,
    getAllReservationsByDate,
    getReservationHoursByDate
}