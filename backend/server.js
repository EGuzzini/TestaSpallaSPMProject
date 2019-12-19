// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const check = require("../backend/app/controller/checkToken.js");
const driver = require("../backend/app/controller/driverController.js");
// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", check.checkToken, driver.checkTokenInit);
var routes = require('./app/routes/appRoutes'); //importing route
app.use(routes); //register the route
app.listen(80, function () {
  console.log("Server is listening on port: 8080");
});
module.exports = app;