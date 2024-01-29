const jwt = require("jwt-simple");
const moment = require("moment");

const libjwt = require("../authorization/jwt");
const secret = libjwt.secret;

exports.auth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({
            "status": "error",
            "message": "Request doesn't have auth header"
        });
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        let payLoad = jwt.decode(token, secret);

        req.user = payLoad;
    } catch (error) {
        return res.status(401).json({
            "status": "error",
            "message": "Token expirado"
        });
    }

    next();
}