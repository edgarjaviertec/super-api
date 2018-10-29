import models from "../models";
import sequelize from "../db";
import bcrypt from "bcrypt";

function generateError(statusCode, field, location, errorMessagesArray) {
    let clientErrorResponses = {
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Payload Too Large",
        414: "URI Too Long",
        415: "Unsupported Media Type",
        416: "Requested Range Not Satisfiable",
        417: "Expectation Failed",
        418: "I'm a teapot",
        421: "Misdirected Request",
        422: "Unprocessable Entity (WebDAV)",
        423: "Locked (WebDAV)",
        424: "Failed Dependency (WebDAV)",
        426: "Upgrade Required",
        428: "Precondition Required",
        429: "Too Many Requests",
        431: "Request Header Fields Too Large",
        451: "Unavailable For Legal Reasons",
    };
    let error = {};
    error.statusCode = statusCode;
    error.statusText = clientErrorResponses[statusCode];
    error.errors = [
        {
            "field": field,
            "location": location,
            "messages": errorMessagesArray
        }
    ];
    return error
}

function encryptPassword(password) {
    return bcrypt.hash(password, 10)
}


function create(req, res) {
    let createUser = (userData) => {
        return models.User.create(userData)
    };
    let getRoles = models.Role.findAll({
        where: {
            name: {
                [sequelize.Op.or]: ['user']
            }
        }
    });
    encryptPassword(req.body.password).then((hashedPassword) => {
        return hashedPassword;
    }).then((hashedPassword) => {
        req.body.password = hashedPassword;
        return Promise.all([createUser(req.body), getRoles])
    }).then((values) => {
        const [user, role] = values;
        user.setRoles(role);
        res.status(201).send(user);
    }).catch((error) => {
        res.status(500).send(error);
    });
}

function addRole(req, res) {

    let userId = req.params.id;
    let requestedRoles = req.body.roles;

    let countRoles = requestedRoles.map((role) => {
        return models.Role.count({
            where: {
                id: role
            }
        })
    });

    let getUser = models.User.findOne({
        attributes: ['id'],
        where: {
            id: userId
        }
    });


    let getRoles = models.Role.findAll({
        attributes: ['id', 'name', 'displayName'],
        where: {
            id: {
                [sequelize.Op.or]: requestedRoles
            }
        }
    });


    Promise.all(countRoles).then((countedRoles) => {
        let nonExistentElementsErrorMessages = [];
        // Revisamos si los roles que nos están pidiendo existen en la base de datos
        countedRoles.forEach((countedRole, index) => {
            if (countedRole === 0) {
                nonExistentElementsErrorMessages.push("role with id " + requestedRoles[index] + " does not exist");
            }
        });
        return nonExistentElementsErrorMessages;
    }).then((nonExistentElementsErrorMessages) => {
        let errorMessages = [...nonExistentElementsErrorMessages];
        // Obtenemos todos los roles del usuario con su Id
        getUser.then((user) => {
            return user.getRoles();
        }).then((results) => {
            let userRoles = [];
            results.forEach((userRole) => {
                userRoles.push(userRole.id)
            });
            // Revisamos si los roles que solicitan son los mismos que el usuario ya tiene asignado
            requestedRoles.forEach((requestedRole) => {
                if (userRoles.includes(requestedRole)) {
                    errorMessages.push(
                        "role with id " + requestedRole + " already been assigned to this user"
                    );
                }
            });
            // Si el arreglo de mensajes de error no esta vacío entonces lanzamos una excepción para terminar la promesa
            if (errorMessages.length > 0) {
                throw errorMessages;
            }
        }).then(() => {



            // res.status(200).send("todo OK");
            // Si no hay algún problema con las validaciones anteriores entonces quitamos los roles solicitados
            Promise.all([getUser, getRoles]).then((results) => {
                const [user, roles] = results;
                user.addRoles(roles);
                res.status(200).send(roles);
            }).catch((error) => {
                res.status(500).send(error);
            })


        }).catch((error) => {
            res.status(400).send(error);
        });
    })

}

function deleteRole(req, res) {

    let userId = req.params.id;
    let requestedRoles = req.body.roles;
    let countRoles = requestedRoles.map((role) => {
        return models.Role.count({
            where: {
                id: role
            }
        })
    });
    let getUser = models.User.findOne({
        attributes: ['id'],
        where: {
            id: userId
        }
    });
    let getRoles = models.Role.findAll({
        attributes: ['id'],
        where: {
            id: {
                [sequelize.Op.or]: requestedRoles
            }
        }
    });

    Promise.all(countRoles).then((countedRoles) => {
        let nonExistentElementsErrorMessages = [];
        let nonExistentElements = [];

        // Si al contar los roles que consultamos alguno devuelve cero, entonces ese rol no existe en la base de datos
        countedRoles.forEach((countedRole, index) => {
            if (countedRole === 0) {
                nonExistentElementsErrorMessages.push("role with ID " + requestedRoles[index] + " does not exist");
                nonExistentElements.push(requestedRoles[index]);
            }
        });

        return [nonExistentElements, nonExistentElementsErrorMessages];

    }).then((results) => {

        const [nonExistentElements, nonExistentElementsErrorMessages] = results;

        let errorMessages = [...nonExistentElementsErrorMessages];

        // Obtenemos todos los roles del usuario con su Id
        getUser.then((user) => {
            return user.getRoles();
        }).then((results) => {
            let userRoles = [];

            results.forEach((userRole) => {
                userRoles.push(userRole.id)
            });

            // Revisamos si los roles que solicitan son los mismos que el usuario ya tiene asignado
            requestedRoles.forEach((requestedRole) => {
                if (!userRoles.includes(requestedRole) && !nonExistentElements.includes(requestedRole)) {
                    errorMessages.push(
                        "role with id " + requestedRole + "  is not assigned to this user"
                    );
                }
            });

            // Si el arreglo de mensajes de error no esta vacío entonces lanzamos una excepción para terminar la promesa
            if (errorMessages.length > 0) {
                throw errorMessages;
            }

        }).then(() => {

            // Si no hay algún problema con las validaciones anteriores entonces quitamos los roles solicitados

            Promise.all([getUser, getRoles]).then((results) => {
                const [user, roles] = results;
                user.removeRoles(roles);
                // Respuesta a una solicitud DELETE exitosa que no devolverá un cuerpo
                res.status(204).send();
            }).catch((error) => {
                res.status(500).send(error);
            })

        }).catch((error) => {
            res.status(400).send(error);
        });

    })

}


module.exports = {
    create: create,
    addRole: addRole,
    deleteRole: deleteRole
};