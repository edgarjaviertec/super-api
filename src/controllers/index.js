import userController from "./userController"
import roleController from "./roleController"
import permissionController from "./permissionController"
import authController from "./authController"

module.exports = {
    auth: authController,
    user: userController,
    role: roleController,
    permission: permissionController
};