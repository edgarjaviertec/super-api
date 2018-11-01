import express from "express";
import bodyParser from "body-parser"
import expressValidation from 'express-validation';
import validate from 'express-validation';
import sequelize from "./db"
import config from "./config"

import userController from './controllers/userController';
import roleController from './controllers/roleController';
import permissionController from './controllers/permissionController';

import mw from './middlewares';
import mod from "./models";
import val from './validations';

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

app.use(bodyParser.json());

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    mod.User.findOne({where: {username: username}}).then((user) => {
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
app.post('/prueba', mw.verifyAccessToken, mw.hasPermission(["editar-usuarios", "crear-usuarios", "eliminar-usuarios"]), (req, res) => {
    res.status(200).send("Todo esta bien");
});
app.post('/register', validate(val.user.register), userController.register);

app.post('/users', validate(val.user.create), userController.create);
app.get('/users', userController.list);
app.get('/users/:id/', mw.checkResourceExists(mod.User), userController.read);
app.put('/users/:id/', mw.checkResourceExists(mod.User), validate(val.user.update), userController.update);
app.delete('/users/:id/', mw.checkResourceExists(mod.User), userController.remove);

app.put('/users/:id/add_roles', mw.checkResourceExists(mod.User), validate(val.user.addOrRemoveRole), userController.addRole);
app.delete('/users/:id/remove_roles', mw.checkResourceExists(mod.User), validate(val.user.addOrRemoveRole), userController.deleteRole);

app.post('/roles', validate(val.role.create), roleController.create);
app.get('/roles/:id', mw.checkResourceExists(mod.Role), roleController.read);
app.get('/roles', roleController.list);
app.put('/roles/:id/', mw.checkResourceExists(mod.Role), validate(val.role.update), roleController.update);
app.delete('/roles/:id/', mw.checkResourceExists(mod.Role), roleController.remove);

app.put('/roles/:id/add_permissions', mw.checkResourceExists(mod.Role), validate(val.role.addOrRemovePermission), roleController.addPermission);
app.delete('/roles/:id/remove_permissions', mw.checkResourceExists(mod.Role), validate(val.role.addOrRemovePermission), roleController.deletePermission);

app.post('/permissions', validate(val.permission.create), permissionController.create);
app.get('/permissions/:id', mw.checkResourceExists(mod.Permission), permissionController.read);
app.get('/permissions', mw.checkResourceExists(mod.Permission), permissionController.list);
app.put('/permissions/:id/', mw.checkResourceExists(mod.Permission), validate(val.permission.update), permissionController.update);
app.delete('/permissions/:id/', mw.checkResourceExists(mod.Permission), permissionController.remove);

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

