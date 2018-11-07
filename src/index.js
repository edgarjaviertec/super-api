import express from "express";
import bodyParser from "body-parser";
import validate from 'express-validation';
import errorhandler from './errorhandler';
import sequelize from './db';
import config from './config';
import con from './controllers';
import mw from './middlewares';
import mod from "./models";
import val from './validations';
import path from "path";

import exphbs from "express-handlebars"

const app = express();

app.use(bodyParser.json());

app.set('views', path.join(__dirname, './views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, './views/layouts'),
    partialsDir: path.join(__dirname, './views/partials')
}));

app.set('view engine', '.hbs');

app.post('/login', con.auth.login);

app.post('/register',
    validate(val.user.register),
    con.account.register);

app.post('/confirmation',
    validate(val.account.confirmation),
    con.account.confirmation);

app.post('/forgot_password',
    validate(val.account.forgotPassword),
    con.account.forgotPassword);

app.get('/forgot_password',
    con.account.renderForgotPassword);

app.get('/reset_password/:token',
    con.account.renderResetPassword);

app.get('/confirmation/:token',
    con.account.renderConfirmation);

app.post('/reset_password',
    validate(val.account.resetPassword),
    con.account.resetPassword);

// app.post('/prueba',
//     mw.verifyAccessToken,
//     mw.hasPermission(["editar-usuarios", "crear-usuarios", "eliminar-usuarios"]),
//     (req, res) => {
//         res.status(200).send("Todo esta bien");
//     });


/* Usuarios */

app.post('/users',
    mw.verifyAccessToken,
    validate(val.user.create),
    mw.hasPermission(["create-users"]),
    con.user.create);

app.get('/users',
    mw.verifyAccessToken,
    mw.hasPermission(["list-users"]),
    con.user.list);

app.get('/users/:id/',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["read-users"]),
    con.user.read);

app.put('/users/:id/',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["update-users"]),
    validate(val.user.update),
    con.user.update);

app.delete('/users/:id/',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["delete-users"]),
    con.user.del);

app.put('/users/:id/add_roles',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["assign-roles-to-user"]),
    validate(val.user.addOrRemoveRole),
    con.user.addRole);

app.delete('/users/:id/remove_roles',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["remove-roles-from-user"]),
    validate(val.user.addOrRemoveRole),
    con.user.deleteRole);

/* Roles*/

app.post('/roles',
    mw.verifyAccessToken,
    validate(val.role.create),
    mw.hasPermission(["create-roles"]),
    con.role.create);

app.get('/roles/:id',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["read-roles"]),
    con.role.read);

app.get('/roles',
    mw.verifyAccessToken,
    mw.hasPermission(["list-roles"]),
    con.role.list);

app.put('/roles/:id/',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["update-roles"]),
    validate(val.role.update),
    con.role.update);

app.delete('/roles/:id/',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["delete-roles"]),
    con.role.remove);

app.put('/roles/:id/add_permissions',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["assign-permissions-to-role"]),
    validate(val.role.addOrRemovePermission),
    con.role.addPermission);

app.delete('/roles/:id/remove_permissions',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["remove-permissions-from-role"]),
    validate(val.role.addOrRemovePermission),
    con.role.deletePermission);

/* Permisos */

app.post('/permissions',
    mw.verifyAccessToken,
    mw.hasPermission(["create-permissions"]),
    validate(val.permission.create),
    con.permission.create);

app.get('/permissions/:id',
    mw.checkResourceExists(mod.Permission),
    mw.verifyAccessToken,
    mw.hasPermission(["read-permissions"]),
    con.permission.read);

app.get('/permissions',
    mw.verifyAccessToken,
    mw.hasPermission(["list-permissions"]),
    con.permission.list);

app.put('/permissions/:id/',
    mw.checkResourceExists(mod.Permission),
    mw.verifyAccessToken,
    mw.hasPermission(["update-permissions"]),
    validate(val.permission.update),
    con.permission.update);

app.delete('/permissions/:id/',
    mw.checkResourceExists(mod.Permission),
    mw.verifyAccessToken,
    mw.hasPermission(["delete-permissions"]),
    con.permission.remove);

app.use(errorhandler);

sequelize.sync().then(runServer);

function runServer() {
    app.listen(config.port, () => {
        console.log(`API REST corriendo en http://localhost:${config.port}`)
    });
}