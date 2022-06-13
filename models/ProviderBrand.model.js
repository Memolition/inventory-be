module.exports = (sequelize, Sequelize) => {
    const ProviderBrand = sequelize.define("ProviderBrand", {
        name: {
            type: Sequelize.STRING
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return ProviderBrand;
};