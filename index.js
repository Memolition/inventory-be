const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./models");

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

const force = false;
db.sequelize.sync({force});

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./routes/Purchase.api")(app);
require("./routes/Product.api")(app);
require("./routes/Person.api")(app);
require("./routes/Order.api")(app);
require("./routes/Movement.api")(app);
require("./routes/Expense.api")(app);
require("./routes/Provider.api")(app);
require("./routes/ProviderLine.api")(app);
require("./routes/ProviderBrand.api")(app);

require("./routes/User.api")(app);
require("./routes/UserRole.api")(app);
require("./routes/RolePermission.api")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});