const jwt = require("jsonwebtoken");
var faker = require("faker");
var mysql = require("mysql");
const { database } = require("faker");

var secretKey = "783b3s9i3jiis9g3hss83h3b8s7b393h3u",
  user = "shuntigs@gmail.com",
  token = jwt.sign({ expiresIn: "0", data: user }, secretKey);

jwt.verify(token, secretKey, function (err, decoded) {
  if (err) {
    console.log("err: ", err.message);
  } else {
    console.log(decoded.data);
  }
});

// Connect to DB
// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "student_hub",
//   password: "HackJam2021",
// });

// Inserting faker data
// var person = {
//   first_name: faker.name.firstName(),
//   last_name: faker.name.lastName(),
//   email: faker.internet.email(),
// };

// var data = [];
// for (var i = 0; i < 100; ++i) {
//   data.push([
//     faker.name.firstName(),
//     faker.name.lastName(),
//     faker.internet.email(),
//   ]);
// }

// var q = "INSERT INTO users (first_name, last_name, email) VALUES ?";

// connection.query(q, [data], function (error, results, fields) {
//   if (error) throw error;
//   console.log(results);
// });

// connection.end();
