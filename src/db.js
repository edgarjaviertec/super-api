import Sequelize from "sequelize";

const sequelize = new Sequelize('database', 'edgar_user', '3dg4r', {
    dialect: "sqlite",
    storage: "database.sqlite"
});

module.exports = sequelize;