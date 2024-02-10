const { Schema, model } = require("mongoose");

const ClassPackageSchema = Schema({
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

module.exports = model("ClassPackage", ClassPackageSchema, "classPackages");