import sequelize from "../db";

const User = sequelize.import(__dirname + "/User");
const Role = sequelize.import(__dirname + "/Role");
const UserRole = sequelize.import(__dirname + "/UserRole");
const Permission = sequelize.import(__dirname + "/Permission");
const RolePermission = sequelize.import(__dirname + "/RolePermission");

// Relación de muchos a muchos entre usuarios y roles

User.belongsToMany(Role, {
    through: UserRole
});

Role.belongsToMany(User, {
    through: UserRole
});


// Relación de muchos a muchos entre roles y permisos

Role.belongsToMany(Permission, {
    through: RolePermission
});

Permission.belongsToMany(Role, {
    through: RolePermission
});


module.exports = {
    User: User,
    Role: Role,
    UserRole: UserRole,
    Permission: Permission,
    RolePermission: RolePermission
};