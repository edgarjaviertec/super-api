import models from "../models";

module.exports = {

    list(req, res) {
        models.Role.findAll().then((permissions) => {
            res.status(200).send(permissions);
        }).catch((error) => {
            res.status(500).send(error);
        })
    },

    create(req, res) {
        models.Permission.create(req.body).then((created) => {
            res.status(201).send(created);
        }).catch((error) => {
            res.status(500).send(error);
        });
    },

    read(req, res) {
        let permissionId = req.params.id;
        models.Permission.findOne({
            where: {
                id: permissionId
            }
        }).then((permission) => {
            res.status(200).send(permission);
        }).catch((error) => {
            res.status(500).send(error);
        })
    },

    update(req, res) {
        let permissionId = req.params.id;
        let updateValues = {
            name: req.body.name,
            displayName: req.body.displayName,
            description: req.body.description
        };
        models.Permission.update(updateValues, {
            where: {
                id: permissionId
            },
            returning: true,
            plain: true
        }).then(() => {
            return models.Permission.findOne({
                where: {
                    id: permissionId
                }
            });
        }).then((updated) => {
            res.status(200).send(updated);
        }).catch((error) => {
            res.status(500).send(error);
        });
    },

    remove(req, res) {
        let permissionId = req.params.id;
        models.Permission.destroy({
            where: {
                id: permissionId
            }
        }).then(() => {
            res.status(204).send();
        }).catch((error) => {
            res.status(500).send(error);
        })
    }

};