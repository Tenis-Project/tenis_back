const Reservation = require("../models/reservationModel");

const create = async (req, res) => {
    let body = req.body;
    let treatmentDetailId = req.query.idTreatmentDetail;
    let doctorId = req.query.idDoctor;
    let campusId = req.query.idCampus;

    if (!body.hour || !body.date) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos de hora o fecha"
        });
    }

    let bodyTreatmentAppointment = {
        treatmentDetail: treatmentDetailId,
        description: body.description,
        date: body.date,
        status: "Agendado",
        hour: body.hour,
        cost: body.cost,
        doctor: doctorId,
        campus: campusId,
        duration: body.duration
    }

    let treatment_appointment_to_save = new TreatmentAppointment(bodyTreatmentAppointment);

    try {
        const treatmentAppointmentStored = await treatment_appointment_to_save.save();

        if (!treatmentAppointmentStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No treatmentAppointment saved"
            });
        }

        const populatedTreatmentAppointment = await TreatmentAppointment.findById(treatmentAppointmentStored._id).populate([{ path: "doctor", populate: { path: "personData", select: 'names fatherLastName motherLastName' }, select: 'personData' }, { path: "campus", populate: {path: 'clinic', select: 'user -_id' }, select: 'name clinic user -_id' }, { path: "treatmentDetail", select: '_id' } ]).sort('hour').select('-__v');

        return res.status(200).json({
            "status": "success",
            "message": "Treatment appointment registered",
            "treatmentAppointment": populatedTreatmentAppointment
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving treatment appointment",
            error
        });
    }
}

const myReservations = async (req, res) => {
    let userId = new ObjectId(req.user.id);

    Reservation.find({ user: userId }).then(reservations => {
        //payments = payments.filter(payment => payment.campus.clinic);
        
        if (reservations.length == 0) {
            return res.status(404).json({
                status: "Error",
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
    myReservations
}