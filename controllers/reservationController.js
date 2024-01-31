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

const myReservations = async (req, res) => {
    Reservation.find({ user: req.user.id }).populate('user class').then(reservations => {        
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

module.exports = {
    create,
    myReservations
}