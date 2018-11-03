import models from "../models";
import sequelize from "../db";
import bcrypt from "bcrypt";

function encryptPassword(password) {
    return bcrypt.hash(password, 10)
}

module.exports = {

    register(req, res) {
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
    },

    addRole(req, res) {
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
    },

    deleteRole(req, res) {
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
    },

    list(req, res) {
        models.User.findAll().then((users) => {
            res.status(200).send(users);
        }).catch((error) => {
            res.status(500).send(error);
        })
    },

    create(req, res) {
        let requestedRoles = req.body.roles;
        let countRoles = requestedRoles.map((role) => {
            return models.Role.count({
                where: {
                    id: role
                }
            })
        });
        let createUser = (userData) => {
            return models.User.create(userData)
        };
        let getRoles = models.Role.findAll({
            where: {
                id: {
                    [sequelize.Op.or]: requestedRoles
                }
            }
        });
        Promise.all(countRoles).then((countedRoles) => {
            let errorMessages = [];
            countedRoles.forEach((countedRole, index) => {
                if (countedRole === 0) {
                    errorMessages.push("role with id " + requestedRoles[index] + " does not exist");
                }
            });
            return errorMessages;
        }).then((errorMessages) => {
            if (errorMessages.length > 0) {
                let error = {
                    statusCode: 400,
                    messages: errorMessages
                };
                throw error;
            }
        }).then(() => {
            return encryptPassword(req.body.password);
        }).then((hashedPassword) => {
            console.log(JSON.stringify(hashedPassword));
            return hashedPassword;
        }).then((hashedPassword) => {
            req.body.password = hashedPassword;
            return Promise.all([createUser(req.body), getRoles])
        }).then((values) => {
            const [user, roles] = values;
            user.setRoles(roles);
            res.status(201).send(user);
        }).catch((error) => {
            if (error.statusCode) {
                res.status(error.statusCode).send({
                    messages: error.messages
                });
            } else {
                res.status(500).send(error);
            }
        });
    },

    read(req, res) {
        let userId = req.params.id;
        models.User.findOne({
            where: {
                id: userId
            }
        }).then((user) => {
            res.status(200).send(user);
        }).catch((error) => {
            res.status(500).send(error);
        })
    },

    update(req, res) {
        let userId = req.params.id;
        let updateValues = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        encryptPassword(req.body.password).then((hashedPassword) => {
            return hashedPassword;
        }).then((hashedPassword) => {
            updateValues.password = hashedPassword;
            return models.User.update(updateValues, {
                where: {
                    id: userId
                },
                returning: true,
                plain: true
            })
        }).then(() => {
            return models.User.findOne({
                where: {
                    id: userId
                }
            });
        }).then((updated) => {
            res.status(200).send(updated);
        }).catch((error) => {
            res.status(500).send(error);
        });
    },

    del(req, res) {
        let userId = req.params.id;
        models.User.destroy({
            where: {
                id: userId
            }
        }).then(() => {
            res.status(204).send();
        }).catch((error) => {
            res.status(500).send(error);
        })
    }

};