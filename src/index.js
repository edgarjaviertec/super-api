import express from "express";
import bodyParser from "body-parser"
import expressValidation from 'express-validation';
import validate from 'express-validation';

import sequelize from "./db"
import config from "./config"
import con from "./controllers"
import mw from './middlewares';
import mod from "./models";
import val from './validations';

const app = express();

app.use(bodyParser.json());


app.post('/register', validate(val.user.register), con.user.register);
app.post('/login', con.auth.login);
app.post('/prueba', mw.verifyAccessToken, mw.hasPermission(["editar-usuarios", "crear-usuarios", "eliminar-usuarios"]), (req, res) => {
    res.status(200).send("Todo esta bien");
});


app.post('/users', validate(val.user.create), con.user.create);
app.get('/users', con.user.list);
app.get('/users/:id/', mw.checkResourceExists(mod.User), con.user.read);
app.put('/users/:id/', mw.checkResourceExists(mod.User), validate(val.user.update), con.user.update);
app.delete('/users/:id/', mw.checkResourceExists(mod.User), con.user.del);
app.put('/user/:id/add_roles', mw.checkResourceExists(mod.User), validate(val.user.addOrRemoveRole), con.user.addRole);
app.delete('/user/:id/remove_roles', mw.checkResourceExists(mod.User), validate(val.user.addOrRemoveRole), con.user.deleteRole);


app.post('/roles', validate(val.role.create), con.role.create);
app.get('/roles/:id', mw.checkResourceExists(mod.Role), con.role.read);
app.get('/roles', con.role.list);
app.put('/roles/:id/', mw.checkResourceExists(mod.Role), validate(val.role.update), con.role.update);
app.delete('/roles/:id/', mw.checkResourceExists(mod.Role), con.role.remove);
app.put('/roles/:id/add_permissions', mw.checkResourceExists(mod.Role), validate(val.role.addOrRemovePermission), con.role.addPermission);
app.delete('/roles/:id/remove_permissions', mw.checkResourceExists(mod.Role), validate(val.role.addOrRemovePermission), con.role.deletePermission);


app.post('/permissions', validate(val.permission.create), con.permission.create);
app.get('/permissions/:id', mw.checkResourceExists(mod.Permission), con.permission.read);
app.get('/permissions', mw.checkResourceExists(mod.Permission), con.permission.list);
app.put('/permissions/:id/', mw.checkResourceExists(mod.Permission), validate(val.permission.update), con.permission.update);
app.delete('/permissions/:id/', mw.checkResourceExists(mod.Permission), con.permission.remove);


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

