module.exports = (sequelize, Sequelize) => {
    const Expense = sequelize.define("Expense", {
        amount: {
            type: Sequelize.STRING
        },
        note: {
            type: Sequelize.STRING
        },
        //TODO: Include selling price
        deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    });
    return Expense;
};