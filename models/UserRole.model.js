module.exports = (sequelize, Sequelize) => {
    const UserRole = sequelize.define("UserRole", {
        name: {
            type: Sequelize.STRING
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return UserRole;
};