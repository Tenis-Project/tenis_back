const Class = require("../models/classModel");

const create = async (req, res) => {
    let body = req.body;

    if (!body.name || !body.time || !body.duration || !body.price || !body.description) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyClass = {
        name: body.name,
        time: body.time,
        duration: body.duration,
        price: body.price,
        description: body.description
    }

    let class_to_save = new Class(bodyClass);

    try {
        const classStored = await class_to_save.save();

        if (!classStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No class saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Class registered",
            "class": classStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving class",
            error
        });
    }
}

const list = (req, res) => {
    Class.find().then(classes => {
        if (!classes) {
            return res.status(404).json({
                status: "Error",
                message: "No classes avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            classes
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
    list
}