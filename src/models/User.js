module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return User;
};