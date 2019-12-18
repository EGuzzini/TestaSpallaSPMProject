
const express = require('express');
const router = express.Router();
const check=require("../controller/checkToken.js");
const parkingslot = require("../controller/parkingController.js");
const driver = require("../controller/driverController.js");

// Create a new Parking slot
router.post("/parking",check.checkToken, parkingslot.create);
// Retrieve all Parking slots
router.get("/parking", parkingslot.findAll);
// Retrieve a single Parking slot with parkingId
router.get("/parking/:parkingId", parkingslot.findOne);
// Update a Parking slot with parkingId
router.put("/parking/:parkingId", parkingslot.update);
// Delete a Parking slot with parkingId
router.delete("/parking/:parkingId", parkingslot.delete);
// delete all parking slots
router.delete("/parking", parkingslot.deleteAll);


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
router.put("/users/:driverId", driver.update);
// Delete a Parking slot with parkingId
router.delete("/users/:driverId", driver.delete);
// delete all parking slots
router.delete("/users", driver.deleteAll);




module.exports = router;