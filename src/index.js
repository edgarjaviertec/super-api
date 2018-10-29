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
import middlewares from './middlewares/test';

const app = express();

app.use(bodyParser.json());

app.post('/prueba', middlewares.prueba, (req, res) => {
    console.log("que onda guey!");
    res.status(200).send("Todo esta bien");
});

app.put('/users/:id/add_roles', validate(validations.user.addOrRemoveRole), userController.addRole);
app.delete('/users/:id/remove_roles', validate(validations.user.addOrRemoveRole), userController.deleteRole);
app.post('/users', validate(validations.user.create), userController.create);

app.post('/roles', validate(validations.role.create), roleController.create);
app.put('/roles/:id/add_permissions', validate(validations.role.addOrRemovePermission), roleController.addPermission);
app.delete('/roles/:id/remove_permissions', validate(validations.role.addOrRemovePermission), roleController.deletePermission);


app.post('/permissions', validate(validations.permission.create), permissionController.create);


// manejador de errores del middleware express-validation
app.use(function (err, req, res, next) {
    if (err instanceof expressValidation.ValidationError) {
        res.status(err.status).json(err);
    }
    else if (err.statusCode) {
        res.status(err.statusCode).send(err);
    } else {
        res.status(500).send(err);
    }
});

sequelize.sync().then(runServer);

function runServer() {
    app.listen(config.port, () => {
        console.log(`API REST corriendo en http://localhost:${config.port}`)
    });
}

