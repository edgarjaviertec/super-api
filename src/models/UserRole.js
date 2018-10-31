module.exports = (sequelize, DataTypes) => {

    const UserRole = sequelize.define("userRole", {}, {
        timestamps: false
    });

    return UserRole;
};