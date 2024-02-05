const { Schema, model } = require("mongoose");

const ReservationSchema = Schema({
    date: {
        type: Date
    },
    hour: {
        type: String
    },
    status: {
        type: String,
        default: "Pendiente"
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    class: {
        type: Schema.ObjectId,
        ref: "Class"
    }
});

module.exports = model("Reservation", ReservationSchema, "reservations");