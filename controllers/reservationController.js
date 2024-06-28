const Reservation = require("../models/reservationModel");

const middlewareService = require("../services/group");

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
        status: body.status,
        classPackage: body.classPackage,
        note: body.note
    }

    let reservation_to_save = new Reservation(bodyReservation);

    try {
        let reservationsUser = await Reservation.find({ user: req.user.id, hour: bodyReservation.hour});
        let today = new Date(bodyReservation.date).setHours(0,0,0,0);

        reservationsUser = reservationsUser.filter(reservation => {
            return new Date(reservation.date).setHours(0,0,0,0) == today
        });

        if (reservationsUser && reservationsUser.length >= 1) {
            return res.status(404).json({
                "status": "error",
                "message": "Fecha y hora ya reservadas"
            });
        }

        let reservations = await Reservation.find({hour: bodyReservation.hour});
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

const getReservationHoursAndSpacesByDate = async (req, res) => {
    let date = req.query.date;
    let today = new Date(date).setHours(0,0,0,0);

    Reservation.find().populate('user class').sort('hour').then(reservations => {
        reservations = reservations.filter(reservation => {
            return new Date(reservation.date).setHours(0,0,0,0) == today;
        });

        if (reservations.length == 0) {
            return res.status(404).json({
                status: "error",
                message: "Reservaciones no encontradas"
            });
        }

        const groupedReservations = middlewareService.groupByHour(reservations);

        return res.status(200).json({
            "status": "success",
            groupedReservations
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getByClassPackageId = async (req, res) => {
    Reservation.find({ classPackage: req.query.idClassPackage }).populate('user class').then(reservations => {
        if (reservations.length == 0) {
            return res.status(404).json({
                status: "error",
                message: "Reservaciones no encontradas para el paquete de clase"
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

const editReservation = (req, res) => {
    let id = req.query.idReservation;

    Reservation.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(reservationUpdated => {
        if (!reservationUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Reservation not found"
            });
        }
        return res.status(200).send({
            status: "success",
            reservation: reservationUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating reservation"
        });
    });
}

const deleteById = async (req, res) => {
    let reservationId = req.body.id;

    Reservation.findOneAndDelete({ "_id": reservationId }).then(reservationDeleted => {
        if (!reservationDeleted) {
            return res.status(500).json({
                "status": "error",
                "message": "No Reservation found"
            });
        }
        return res.status(200).json({
            "status": "success",
            "message": "Reservation deleted successfully"
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            "message": "Error while deleting Reservation"
        });
    });
}

module.exports = {
    create,
    myReservationsByDate,
    getAllReservationsByDate,
    getReservationHoursAndSpacesByDate,
    getByClassPackageId,
    editReservation,
    deleteById
}