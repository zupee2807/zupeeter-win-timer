const mysql = require("mysql2");
require("dotenv").config();
// Create a connection to the database
const connection = mysql.createConnection({
  host: "103.120.176.66",
  user: "administrator_5starxxxcm",
  password: "5GxzxY9!rV14",
  database: "administrator_5starxxxcm",
  multipleStatements: true,
});

// open the MySQL connection
connection.connect((error) => {
  if (error) {
    console.log(error);
    return;
  }
  console.log("Successfully connected to the database.");
});

module.exports = connection;
