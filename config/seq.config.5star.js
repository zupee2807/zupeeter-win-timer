const { Sequelize } = require("sequelize");
const sequelize5star = new Sequelize(
  "administrator_5starxxxcm", // db name
  "administrator_5starxxxcm", // username
  "5GxzxY9!rV14", // password
  {
    dialect: "mysql",
    host: "103.120.176.66",
    logging: false,
  }
);
module.exports = sequelize5star;
