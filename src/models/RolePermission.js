module.exports = (sequelize, DataTypes) => {

    const RolePermission = sequelize.define("rolePermission", {}, {
        timestamps: false
    });

    return RolePermission;
};