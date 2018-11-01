import express from "express";
import config from "../config"
import models from "../models";

var router = express.Router();
const jwt = require('jsonwebtoken');

let checkResourceExists = function (req, res, next) {
    let userId = req.params.id;
    models.User.count({
        where: {
            id: userId
        }
    }).then((user) => {
        if (user > 0) {
            next();
        } else {
            let error = {};
            error.statusCode = 404;
            error.message = "404 Not Found";
            next(error);
        }
    }).catch((error) => {
        next(error);
    })
};


function arrayContainsArray(superset, subset) {
    if (0 === subset.length) {
        return false;
    }
    return subset.every(function (value) {
        return (superset.indexOf(value) >= 0);
    });
}


function hasPermission(requestedPermissions) {
    return function (req, res, next) {
        if (req.decoded && Array.isArray(requestedPermissions)) {
            if (req.decoded.id) {
                let userId = req.decoded.id;
                let getUser = models.User.findOne({
                    attributes: ['id'],
                    where: {
                        id: userId
                    }
                });
                getUser
                    .then((user) => {
                        return user.getRoles();
                    })
                    .then((roles) => {
                        return roles.map((role) => {
                            return models.Role.findOne({
                                where: {
                                    id: role.id
                                }
                            }).then((role) => {
                                return role.getPermissions();
                            })
                        });
                    })
                    .then((results) => {
                        return Promise.all(results);
                    })
                    .then((results) => {

                        let userPermissionsArray = results.map((permission) => {
                            return permission.map((currentValue) => {
                                return currentValue.name;
                            });
                        });
                        var userPermissions = [];
                        // Convierte una matriz 2d a 1d
                        for (let i = 0; i < userPermissionsArray.length; i++) {
                            userPermissions = userPermissions.concat(userPermissionsArray[i]);
                        }
                        let isMatch = arrayContainsArray(userPermissions, requestedPermissions);
                        if (isMatch) {
                            next()
                        } else {
                            let error = {
                                "statusCode": 401,
                                "message": "Insufficient Permission",
                            };
                            throw error;
                        }
                    })
                    .catch((error) => {
                        next(error);
                    });
            }

        } else {
            next();
        }
    }
}

let verifyAccessToken = function (req, res, next) {
    console.log("midd de verificacion de token");
    let accessToken;
    let hasMultiplePlaces = false;
    const QUERY_AUTHORIZACION_KEY = 'access_token';
    const BODY_AUTHORIZACION_KEY = 'access_token';
    const HEADER_AUTHORIZACION_KEY = 'Bearer';
    if (req.query && req.query[QUERY_AUTHORIZACION_KEY]) {
        accessToken = req.query[QUERY_AUTHORIZACION_KEY];
    }
    if (req.body && req.body[BODY_AUTHORIZACION_KEY]) {
        if (accessToken) {
            hasMultiplePlaces = true;
        }
        accessToken = req.body[BODY_AUTHORIZACION_KEY];
    }
    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === HEADER_AUTHORIZACION_KEY) {
            if (accessToken) {
                hasMultiplePlaces = true;
            }
            accessToken = parts[1];
        } else {
            let error = {
                "statusCode": 400,
                "message": "Bad HTTP authentication header format",
            };
            next(error);
        }
    }
    if (hasMultiplePlaces) {
        let error = {
            "statusCode": 400,
            "message": "RFC6750 states the access_token MUST NOT be provided in more than one place in a single request",
        };
        next(error);
    } else {
        if (accessToken) {
            jwt.verify(accessToken, config.accessTokenSecret, function (err, decoded) {
                if (err) {
                    let error = {
                        "statusCode": 401,
                        "message": err.message,
                    };
                    next(error)
                }
                req.decoded = decoded;
                console.log("se supone que todo esta bien");
                next();
            });
        } else {
            let error = {
                "statusCode": 401,
                "message": "No token provided",
            };
            next(error);
        }
    }
};


module.exports = {
    checkResourceExists: checkResourceExists,
    verifyAccessToken: verifyAccessToken,
    hasPermission: hasPermission
};