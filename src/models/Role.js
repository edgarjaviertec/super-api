module.exports = (sequelize, DataTypes) => {

    const Role = sequelize.define("role", {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });


    return Role;
};