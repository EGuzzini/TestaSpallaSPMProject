// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send({ message: "Welcome to our application." });
  });
var routes = require('./app/routes/appRoutes'); //importing route
app.use(routes); //register the route
app.listen(8080, () => {
    console.log("Server is listening on port: 8080");
  });
module.exports=app;