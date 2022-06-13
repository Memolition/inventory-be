module.exports = (sequelize, Sequelize) => {
    const ProviderLine = sequelize.define("ProviderLine", {
        name: {
            type: Sequelize.STRING
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return ProviderLine;
};