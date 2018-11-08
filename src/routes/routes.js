import express from 'express';
const router = express.Router();

import con from '../controllers';
import mw from '../middlewares';
import mod from "../models";
import val from '../validations';
import validate from 'express-validation';

/**
 * Authorization routes
 */
router
    .post('/login', con.auth.login)
    .post('/register',
        validate(val.user.register),
        con.account.register)
    .post('/confirmation',
        validate(val.account.confirmation),
        con.account.confirmation)
    .post('/forgot_password',
        validate(val.account.forgotPassword),
        con.account.forgotPassword)
    .get('/forgot_password',
        con.account.renderForgotPassword)
    .get('/reset_password/:token',
        con.account.renderResetPassword)
    .get('/confirmation/:token',
        con.account.renderConfirmation)
    .post('/reset_password',
        validate(val.account.resetPassword),
        con.account.resetPassword);

/* Usuarios */
router
    .post('/users',
        mw.verifyAccessToken,
        validate(val.user.create),
        mw.hasPermission(["create-users"]),
        con.user.create)
    .get('/users',
        mw.verifyAccessToken,
        mw.hasPermission(["list-users"]),
        con.user.list)
    // .get('/users/show-error-500/', con.user.showError500)
    // .get('/users/show-error-400/', con.user.showError400)
    // .get('/users/show-custom-error/', con.user.showCustomError)
    .get('/users/:id/',
        mw.checkResourceExists(mod.User),
        mw.verifyAccessToken,
        mw.hasPermission(["read-users"]),
        con.user.read)
    .put('/users/:id/',
        mw.checkResourceExists(mod.User),
        mw.verifyAccessToken,
        mw.hasPermission(["update-users"]),
        validate(val.user.update),
        con.user.update)
    .delete('/users/:id/',
        mw.checkResourceExists(mod.User),
        mw.verifyAccessToken,
        mw.hasPermission(["delete-users"]),
        con.user.del)
    .put('/users/:id/add_roles',
        mw.checkResourceExists(mod.User),
        mw.verifyAccessToken,
        mw.hasPermission(["assign-roles-to-user"]),
        validate(val.user.addOrRemoveRole),
        con.user.addRole)
    .delete('/users/:id/remove_roles',
        mw.checkResourceExists(mod.User),
        mw.verifyAccessToken,
        mw.hasPermission(["remove-roles-from-user"]),
        validate(val.user.addOrRemoveRole),
        con.user.deleteRole);

/* Roles*/
router
    .post('/roles',
        mw.verifyAccessToken,
        validate(val.role.create),
        mw.hasPermission(["create-roles"]),
        con.role.create)
    .get('/roles/:id',
        mw.checkResourceExists(mod.Role),
        mw.verifyAccessToken,
        mw.hasPermission(["read-roles"]),
        con.role.read)
    .get('/roles',
        mw.verifyAccessToken,
        mw.hasPermission(["list-roles"]),
        con.role.list)
    .put('/roles/:id/',
        mw.checkResourceExists(mod.Role),
        mw.verifyAccessToken,
        mw.hasPermission(["update-roles"]),
        validate(val.role.update),
        con.role.update)
    .delete('/roles/:id/',
        mw.checkResourceExists(mod.Role),
        mw.verifyAccessToken,
        mw.hasPermission(["delete-roles"]),
        con.role.remove)
    .put('/roles/:id/add_permissions',
        mw.checkResourceExists(mod.Role),
        mw.verifyAccessToken,
        mw.hasPermission(["assign-permissions-to-role"]),
        validate(val.role.addOrRemovePermission),
        con.role.addPermission)
    .delete('/roles/:id/remove_permissions',
        mw.checkResourceExists(mod.Role),
        mw.verifyAccessToken,
        mw.hasPermission(["remove-permissions-from-role"]),
        validate(val.role.addOrRemovePermission),
        con.role.deletePermission);

/* Permisos */

router
    .post('/permissions',
        mw.verifyAccessToken,
        mw.hasPermission(["create-permissions"]),
        validate(val.permission.create),
        con.permission.create)
    .get('/permissions/:id',
        mw.checkResourceExists(mod.Permission),
        mw.verifyAccessToken,
        mw.hasPermission(["read-permissions"]),
        con.permission.read)
    .get('/permissions',
        mw.verifyAccessToken,
        mw.hasPermission(["list-permissions"]),
        con.permission.list)
    .put('/permissions/:id/',
        mw.checkResourceExists(mod.Permission),
        mw.verifyAccessToken,
        mw.hasPermission(["update-permissions"]),
        validate(val.permission.update),
        con.permission.update)
    .delete('/permissions/:id/',
        mw.checkResourceExists(mod.Permission),
        mw.verifyAccessToken,
        mw.hasPermission(["delete-permissions"]),
        con.permission.remove);

module.exports = router;