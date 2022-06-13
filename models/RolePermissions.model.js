module.exports = (sequelize, Sequelize) => {
    const RolePermissions = sequelize.define("RolePermissions", {
        name: {
            type: Sequelize.STRING
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return RolePermissions;
};