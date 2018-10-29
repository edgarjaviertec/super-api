module.exports = (sequelize, DataTypes) => {

    const Permission = sequelize.define("permission", {
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


    return Permission;
};