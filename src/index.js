import express from "express";
import bodyParser from "body-parser"
import expressValidation from 'express-validation';
import validate from 'express-validation';
import sequelize from "./db"
import config from "./config"
import validations from './validation';
import userController from './controllers/userController';
import roleController from './controllers/roleController';
import permissionController from './controllers/permissionController';
import middlewares from './middlewares';
import models from "./models";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

app.use(bodyParser.json());

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    models.User.findOne({where: {username: username}}).then((user) => {
        return user;
    }).then((user) => {
        let userPassword = '';
        if (user !== null) {
            userPassword = user.password;
        }
        bcrypt.compare(password, userPassword).then(function (isMatch) {
            if (isMatch) {
                const payLoad = {
                    "id": user.id
                };

                console.log("TIEMPO DE TOKEN: " + config.accessTokenLife);
                const accessToken = jwt.sign(payLoad, config.accessTokenSecret,
                    {
                        expiresIn: config.accessTokenLife
                    });
                const response = {
                    "access_token": accessToken,
                    "token_type": "Bearer"
                };
                res.status(200).send(response);
            } else {
                let error = {};
                error.message = "Bad credentials";
                throw error
            }
        }).catch((err) => {
            res.status(401).send(err);
        });
    }).catch((e) => {
        res.status(500).send(e);
    })
});

app.post('/prueba', middlewares.verifyAccessToken, middlewares.hasPermission(["editar-usuarios", "crear-usuarios", "eliminar-usuarios"]), (req, res) => {
    res.status(200).send("Todo esta bien");
});


app.put('/users/:id/add_roles', validate(validations.user.addOrRemoveRole), userController.addRole);
app.delete('/users/:id/remove_roles', validate(validations.user.addOrRemoveRole), userController.deleteRole);
app.post('/register', validate(validations.user.create), userController.create);

app.post('/roles', validate(validations.role.create), roleController.create);
app.put('/roles/:id/add_permissions', validate(validations.role.addOrRemovePermission), roleController.addPermission);
app.delete('/roles/:id/remove_permissions', validate(validations.role.addOrRemovePermission), roleController.deletePermission);

app.post('/permissions', validate(validations.permission.create), permissionController.create);


app.use(function (err, req, res, next) {
    if (err instanceof expressValidation.ValidationError) {
        let newErrorMessages = [];
        if (err.errors.length > 0) {
            err.errors.forEach((errorItem) => {


                if (errorItem.types.length > 0 && errorItem.types.length === errorItem.messages.length) {
                    for (let i = 0; i < errorItem.types.length; i++) {
                        if (errorItem.field.length > 1) {
                            var re = /\"(.*?)\"/gm;
                            var subst = '[$1]';
                            newErrorMessages.push({
                                "code": errorItem.types[i],
                                "field": errorItem.field[0] + errorItem.messages[i].replace(re, subst)
                            });
                        } else {

                            newErrorMessages.push({
                                "code": errorItem.types[i],
                                "field": errorItem.messages[i].replace(/[\"]/g, '')
                            });

                        }

                    }
                }

            })
        }
        res.status(err.status).json({
            "errors": newErrorMessages
        });
    }
    else if (err.statusCode) {
        res.status(err.statusCode).send({
            "message": err.message
        });
    } else {
        res.status(500).send({
            "message": "Internal Server Error"
        });
    }
});

sequelize.sync().then(runServer);

function runServer() {
    app.listen(config.port, () => {
        console.log(`API REST corriendo en http://localhost:${config.port}`)
    });
}

