const express = require('express');
const router = express.Router();
const check = require("../controller/checkToken.js");
const parkingslot = require("../controller/parkingController.js");
const driver = require("../controller/driverController.js");
const send = require("../controller/mailSender.js");


// Create a new Parking slot
router.post("/parking", parkingslot.create);
// Retrieve all Parking slots
router.get("/parking", parkingslot.findAll);
// Retrieve a single Parking slot with parkingId
router.get("/parking/:parkingId", parkingslot.findOne);
// Update a Parking slot with parkingId
router.put("/parking/:parkingId", check.checkToken, parkingslot.update);
// Delete a Parking slot with parkingId
router.delete("/parking/:parkingId", check.checkToken, parkingslot.delete);
// delete all parking slots
router.delete("/parking", check.checkToken, parkingslot.deleteAll);
// nearest park to destination
router.get("/parkingnearest/:destination", parkingslot.nearest);
// Retrieve a single Parking slot with parkingId
router.get("/parking/notification/:parkingId",parkingslot.notification );


// routes for driver
//create a new user
router.post("/register", driver.create);
//login route
router.post("/login", driver.login)

//get all users
router.get("/users", driver.findAll);
// Retrieve a single driver with parkingId
router.get("/users/:driverId", driver.findOne);
// Update a driver with driverId
router.put("/users/:driverId", check.checkToken, driver.update);
// Delete a Parking slot with parkingId
router.delete("/usersid", check.checkToken, driver.delete);
// delete all parking slots
router.delete("/users", driver.deleteAll);
//report a problem with an email
router.post("/users/:driverId/report", check.checkToken, send.sendMail);
//Recovery password
router.put("/passwordReset", driver.recoveryPassword);
//Delete account user
router.delete("/users/:driverId/deleteAccount", check.checkToken, driver.delete);
//Change account password
router.put("/users/:driverId/changePassword", check.checkToken, driver.changePassword);


module.exports = router;