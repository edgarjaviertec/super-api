import models from "../models";
import sequelize from "../db";


function list(req, res) {
    models.Role.findAll().then((roles) => {
        res.status(200).send(roles);
    }).catch((error) => {
        res.status(500).send(error);
    })
}

function create(req, res) {
    models.Role.create(req.body).then((created) => {
        res.status(201).send(created);
    }).catch((error) => {
        res.status(500).send(error);
    });
}

function read(req, res) {
    let roleId = req.params.id;
    models.Role.findOne({
        where: {
            id: roleId
        }
    }).then((role) => {
        res.status(200).send(role);
    }).catch((error) => {
        res.status(500).send(error);
    })
}

function update(req, res) {
    let roleId = req.params.id;
    let updateValues = {
        name: req.body.name,
        displayName: req.body.displayName,
        description: req.body.description
    };
    models.Role.update(updateValues, {
        where: {
            id: roleId
        },
        returning: true,
        plain: true
    }).then(() => {
        return models.Role.findOne({
            where: {
                id: roleId
            }
        });
    }).then((updated) => {
        res.status(200).send(updated);
    }).catch((error) => {
        res.status(500).send(error);
    });
}

function remove(req, res) {
    let roleId = req.params.id;
    models.Role.destroy({
        where: {
            id: roleId
        }
    }).then(() => {
        res.status(204).send();
    }).catch((error) => {
        res.status(500).send(error);
    })
}


function addPermission(req, res) {

    let roleId = req.params.id;
    let requestedPermissions = req.body.permissions;

    let countPermissions = requestedPermissions.map((permission) => {
        return models.Permission.count({
            where: {
                id: permission
            }
        })
    });

    let getRole = models.Role.findOne({
        attributes: ['id'],
        where: {
            id: roleId
        }
    });

    let getPermissions = models.Permission.findAll({
        attributes: ['id', 'name', 'displayName'],
        where: {
            id: {
                [sequelize.Op.or]: requestedPermissions
            }
        }
    });


    Promise.all(countPermissions).then((results) => {
        let nonExistentElementsErrorMessages = [];
        // Revisamos si el permiso que nos están pidiendo existen en la base de datos
        results.forEach((countPermission, index) => {
            if (countPermission === 0) {
                nonExistentElementsErrorMessages.push("permission with id " + requestedPermissions[index] + " does not exist");
            }
        });
        return nonExistentElementsErrorMessages;
    }).then((nonExistentElementsErrorMessages) => {
        let errorMessages = [...nonExistentElementsErrorMessages];
        // Obtenemos todos los pemrisos del role con su Id
        getRole.then((role) => {


            return role.getPermissions();


        }).then((results) => {
            let rolePermissions = [];
            results.forEach((rolePermission) => {
                rolePermissions.push(rolePermission.id)
            });
            // Revisamos si los permisos que solicitan son los mismos que el role ya tiene asignado
            requestedPermissions.forEach((requestedPermission) => {
                if (rolePermissions.includes(requestedPermission)) {
                    errorMessages.push(
                        "permission with id " + requestedPermission + " already been assigned to this role"
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
            Promise.all([getRole, getPermissions]).then((results) => {
                const [role, permissions] = results;

                //console.log("---> role: " + JSON.stringify(role));
                //console.log("---> permissions: " + JSON.stringify(permissions));

                role.addPermissions(permissions);
                res.status(200).send(permissions);
                //res.status(200).send("OK");
            }).catch((error) => {
                res.status(500).send(error);
            })


        }).catch((error) => {
            res.status(400).send(error);
        });
    })

}

function deletePermission(req, res) {

    let userId = req.params.id;
    let requestedPermissions = req.body.permissions;

    let countPermissions = requestedPermissions.map((permission) => {
        return models.Permission.count({
            where: {
                id: permission
            }
        })
    });
    let getRole1 = models.Role.findOne({
        attributes: ['id'],
        where: {
            id: userId
        }
    });
    let getPermissions = models.Permission.findAll({
        attributes: ['id'],
        where: {
            id: {
                [sequelize.Op.or]: requestedPermissions
            }
        }
    });

    Promise.all(countPermissions).then((results) => {
        let nonExistentElementsErrorMessages = [];
        let nonExistentElements = [];

        // Si al contar los roles que consultamos alguno devuelve cero, entonces ese rol no existe en la base de datos
        results.forEach((countedPermission, index) => {
            if (countedPermission === 0) {
                nonExistentElementsErrorMessages.push("permission with id " + requestedPermissions[index] + " does not exist");
                nonExistentElements.push(requestedPermissions[index]);
            }
        });

        return [nonExistentElements, nonExistentElementsErrorMessages];

    }).then((results) => {

        const [nonExistentElements, nonExistentElementsErrorMessages] = results;

        let errorMessages = [...nonExistentElementsErrorMessages];

        // Obtenemos todos los roles del usuario con su Id
        getRole1.then((role) => {
            // return role.getPermissions();


            return role.getPermissions();
        }).then((results) => {

            // let rolePermissions = [];
            let rolePermissions = [];

            results.forEach((rolePermission) => {
                rolePermissions.push(rolePermission.id)
            });

            // Revisamos si los roles que solicitan son los mismos que el usuario ya tiene asignado
            requestedPermissions.forEach((requestedPermission) => {
                if (!rolePermissions.includes(requestedPermission) && !nonExistentElements.includes(requestedPermission)) {
                    errorMessages.push(
                        "permission with id " + requestedPermission + " is not assigned to this role"
                    );
                }
            });

            // Si el arreglo de mensajes de error no esta vacío entonces lanzamos una excepción para terminar la promesa
            if (errorMessages.length > 0) {
                throw errorMessages;
            }

        }).then(() => {

            // Si no hay algún problema con las validaciones anteriores entonces quitamos los roles solicitados

            Promise.all([getRole1, getPermissions]).then((results) => {
                const [role, permissions] = results;
                role.removePermissions(permissions);
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
    list: list,
    create: create,
    read: read,
    update: update,
    remove: remove,
    addPermission: addPermission,
    deletePermission: deletePermission
};