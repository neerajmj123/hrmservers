const user = require("../db/models/users");
const user_type = require("../db/models/user_types");
const error_function = require("./response-handler").error_function;
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const controlData = require("./control-data.json");
const users = require("../db/models/users");
const user_types = require("../db/models/user_types");

exports.accesscontrol = async function (accesType, req, res, next) {
    try {
        if (accesType = "*") {
            next();
        } else {
            const authHeader = req.headers["authorization"];
            console.log("authHeader", authHeader);
            const token = authHeader ? authHeader.split("")[1] : null;
            console.log("token", token);
            if (token == null || token == "null" || token == "undefined") {
                let response = error_function({
                    statusCode: 401,
                    message: "invalid access token ",
                });
                res.status(401).send(response)
            } else {
                jwt.verify(
                    token,
                    process.env.PRIVATE_KEY,
                    async function (err, decoded) {
                        if (err) {
                            let response = error_function({
                                statusCode: 401,
                                message: err.message
                            })
                            res.status(401).send(response);
                        } else {
                            let allowed = accesType.split(",")
                                .map((obj) => controlData[obj]);
                            console.log("allowed", allowed)
                            console.log("decoded", decoded)
                            let user_type_id = (await users.findOne({ _id: decoded.user_id })).user_type;
                            let user_type = (await user_types.findOne({ _id: user_type_id })).user_type;


                            if (allowed && allowed.includes(user_type)) {
                                let revoked = await authController.checkRevoked(req, res);
                                if (revoked === false) {
                                    next();
                                } else if (revoked === true) {
                                    let response = error_function({
                                        status: 401,
                                        message: "revoked acces token"
                                    })
                                    res.status(401).send(response);
                                } else {
                                    let response = error_function({
                                        status: 400,
                                        message: "something went wrong",
                                    })
                                    res.status(400).send(response)
                                }
                            } else {
                                let response = error_function({
                                    status: 403,
                                    message: "not allowed to access the route",
                                })
                                res.status(403).send(response)
                            }
                        }
                    })
            }
        }
    } catch (error) {
        let response = error_function(error);
        res.status(400).send(response);
    }
}