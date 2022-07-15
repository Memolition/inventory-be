const dbConfig = require("../db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./User.model.js")(sequelize, Sequelize);
db.userRoles = require("./UserRole.model.js")(sequelize, Sequelize);
db.rolePermissions = require("./RolePermissions.model.js")(sequelize, Sequelize);

db.purchases = require("./Purchase.model.js")(sequelize, Sequelize);
db.products = require("./Product.model.js")(sequelize, Sequelize);
db.importProducts = require("./ImportProduct.model.js")(sequelize, Sequelize);
db.people = require("./Person.model.js")(sequelize, Sequelize);
db.orders = require("./Order.model.js")(sequelize, Sequelize);
db.movements = require("./Movement.model.js")(sequelize, Sequelize);
db.expenses = require("./Expense.model.js")(sequelize, Sequelize);
db.providers = require("./Provider.model.js")(sequelize, Sequelize);
db.providerLines = require("./ProviderLine.model.js")(sequelize, Sequelize);
db.providerBrands = require("./ProviderBrand.model.js")(sequelize, Sequelize);
db.productStock = require("./ProductStock.model.js")(sequelize, Sequelize);

db.people.hasMany(db.orders);
db.orders.belongsTo(db.people);
db.orders.hasMany(db.movements);
db.purchases.hasMany(db.movements);
db.purchases.belongsTo(db.providers);
db.movements.belongsTo(db.orders);
db.movements.belongsTo(db.products);
db.movements.belongsTo(db.purchases);

db.products.belongsTo(db.providers);
db.products.hasMany(db.movements);
db.providers.hasMany(db.products);

db.productStock.belongsTo(db.products);

db.providers.belongsToMany(db.providerLines, { through: 'ProviderProviderLines' });
db.providerLines.belongsToMany(db.providers, { through: 'ProviderProviderLines' });

db.providers.belongsToMany(db.providerBrands, { through: 'ProviderProviderBrands' });
db.providerBrands.belongsToMany(db.providers, { through: 'ProviderProviderBrands' });

db.users.belongsTo(db.userRoles);
db.userRoles.hasMany(db.users);

db.userRoles.belongsToMany(db.rolePermissions, { through: 'UserRolesPermissions' });
db.rolePermissions.belongsToMany(db.userRoles, { through: 'UserRolesPermissions' });

module.exports = db;