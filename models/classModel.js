const { Schema, model } = require("mongoose");

const ClassSchema = Schema({
    name: {
        type: String
    },
    time: {
        type: String
    },
    duration: {
        type: String
    },
    price: {
        type: Number
    },
    description: [{
        type: String
    }]
});

module.exports = model("Class", ClassSchema, "classes");