const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  "zupeetercm_zptrrrrlhdjnew", // db name
  "zupeetercm_zptrrrrlhdjnew", // username
  "v&z!CJLC57sx", // password
  {
    dialect: "mysql",
    host: "103.120.176.66",
    logging: false,
  }
);
module.exports = sequelize;
