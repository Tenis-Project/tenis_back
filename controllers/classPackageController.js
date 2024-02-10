const ClassPackage = require("../models/classPackageModel");

const create = async (req, res) => {
    let body = req.body;

    if (!body.class) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let bodyClassPackage = {
        user: req.user.id,
        class: body.class,
    }

    let classPackage_to_save = new ClassPackage(bodyClassPackage);

    try {
        const classPackageStored = await classPackage_to_save.save();

        if (!classPackageStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No class package saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Class Package registered",
            "classPackage": classPackageStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving classPackage",
            error
        });
    }
}

const myClassPackages = async (req, res) => {
    ClassPackage.find({ user: req.user.id }).populate('user class').then(classPackages => {
        if (classPackages.length == 0) {
            return res.status(404).json({
                status: "error",
                message: "Paquetes de clase no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            classPackages
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getAllStandByClassPackages = async (req, res) => {
    ClassPackage.find({ status: "Pendiente" }).populate('user class').then(classPackages => {
        if (classPackages.length == 0) {
            return res.status(404).json({
                status: "error",
                message: "Paquetes de clase no encontradas"
            });
        }

        return res.status(200).json({
            "status": "success",
            classPackages
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const editClassPackage = (req, res) => {
    let id = req.query.idClassPackage;

    ClassPackage.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(classPackageUpdated => {
        if (!classPackageUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Class package not found"
            });
        }
        return res.status(200).send({
            status: "success",
            classPackage: classPackageUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating class package"
        });
    });
}

const deleteById = async (req, res) => {
    let classPackageId = req.body.id;

    ClassPackage.findOneAndDelete({ "_id": classPackageId }).then(classPackageDeleted => {
        if (!classPackageDeleted) {
            return res.status(500).json({
                "status": "error",
                "message": "No Class Package found"
            });
        }
        return res.status(200).json({
            "status": "success",
            "message": "Class Package deleted successfully"
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            "message": "Error while deleting class package"
        });
    });
}

module.exports = {
    create,
    myClassPackages,
    getAllStandByClassPackages,
    editClassPackage,
    deleteById
}