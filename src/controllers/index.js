import userController from "./userController"
import roleController from "./roleController"
import permissionController from "./permissionController"
import authController from "./authController"
import accountController from "./accountController"

module.exports = {
    account: accountController,
    auth: authController,
    user: userController,
    role: roleController,
    permission: permissionController
};