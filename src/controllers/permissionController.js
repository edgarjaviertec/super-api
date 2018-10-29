import models from "../models";
import sequelize from "../db";

function create(req, res) {
    models.Permission.create(req.body).then((created) => {
        res.status(201).send(created);
    }).catch((error) => {
        res.status(500).send(error);
    });
}

module.exports = {
    create: create,
};