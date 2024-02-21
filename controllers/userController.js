const User = require("../models/userModel");

const bcrypt = require("bcrypt");
const jwt = require("../authorization/jwt");

const register = async (req, res) => {
    let userBody = req.body;

    if (!userBody.username || !userBody.password || !userBody.name || !userBody.lastName || !userBody.dni || !userBody.phone) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    let userData = {
        username: userBody.username,
        password: userBody.password,
        name: userBody.name,
        lastName: userBody.lastName,
        dni: userBody.dni,
        phone: userBody.phone
    }

    try {
        const userAlreadyExist = await User.find({ username: userData.username });

        if (userAlreadyExist.length >= 1) {
            return res.status(400).json({
                "status": "error",
                "message": "El usuario ya existe"
            });
        }

        let pwd = await bcrypt.hash(userData.password, 10);
        userData.password = pwd;

        let user_to_save = new User(userData);

        try {
            const userStored = await user_to_save.save();

            if (!userStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No user saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Usuario registrado",
                "user": userStored
            });

        } catch {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving user"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding user duplicate"
        });
    }
}

const loginUser = (req, res) => {
    const body = req.body;
    console.log(body);

    if (!body.username || !body.password) {
        return res.status(400).json({
            "status": "error",
            "message": "Faltan datos"
        });
    }

    User.findOne({ username: body.username }).then(user => {
        console.log(user);
        if (!user) {
            return res.status(400).json({
                "status": "error",
                "message": "Usuario no existe"
            });
        }

        if (user.role != body.role) {
            return res.status(400).json({
                "status": "error",
                "message": "Credenciales pertenecientes a otro rol"
            });
        }

        let pwd = bcrypt.compareSync(body.password, user.password);

        if (!pwd) {
            return res.status(400).json({
                "status": "error",
                "message": "Contraseña incorrecta"
            });
        }

        const token = jwt.createToken(user);

        return res.status(200).json({
            "status": "success",
            "message": "Te haz identificado correctamente",
            "user": {
                "_id": user._id,
                "username": user.username,
                "role": user.role
            },
            token
        });

    }).catch(() => {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding user"
        });
    });
}

const myObject = (req, res) => {
    User.findById(req.user.id).select('-__v').then(user => {
        if (!user) {
            return res.status(404).json({
                "status": "error",
                "message": "El usuario no existe"
            });
        }

        return res.status(200).json({
            "status": "success",
            "user": user
        });
    }).catch(() => {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding user"
        });
    });
}

module.exports = {
    register,
    loginUser,
    myObject
}