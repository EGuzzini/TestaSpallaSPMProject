const express = require('express');
const router = express.Router();
const check = require("../controller/checkToken.js");
const parkingslot = require("../controller/parkingController.js");
const driver = require("../controller/driverController.js");
const send = require("../controller/mailSender.js");


// Create a new Parking slot
router.post("/parking", check.checkToken, parkingslot.create);
// Retrieve all Parking slots
router.get("/parking", check.checkToken, parkingslot.findAll);
// Retrieve a single Parking slot with parkingId
router.get("/parking/:parkingId", check.checkToken, parkingslot.findOne);
// Update a Parking slot with parkingId
router.put("/parking/:parkingId", check.checkToken, parkingslot.update);
// Delete a Parking slot with parkingId
router.delete("/parking/:parkingId", check.checkToken, parkingslot.delete);
// delete all parking slots
router.delete("/parking", check.checkToken, parkingslot.deleteAll);
// nearest park to destination
router.get("/parkingnearest/:destination", check.checkToken, parkingslot.nearest);
// send notification to municipality police for unauthorized parking
router.get("/parking/notification/:parkingId", check.checkToken, parkingslot.notification);// DA RIVEDERE
//cancellation of park reserved
router.get("/parkingnearest/cancellation/:park", check.checkToken, parkingslot.cancel);
//driver parked in designated area
router.get("/parking/parked/parkedslot",check.checkToken, parkingslot.parked);
//driver park occupied
router.get("/parking/parked/parkoccupied",check.checkToken, parkingslot.parktaken);
//possible park malfunction
router.get("/parking/parked/malfunction",check.checkToken, parkingslot.malfunction);


// routes for driver
//create a new user
router.post("/register", driver.create);
//login route
router.post("/login", driver.login)
//get all users
router.get("/users", driver.findAll);
// Retrieve a single driver with Id
router.get("/users/:driverId", driver.findOne);
// Update a driver with driverId
router.put("/users/:driverId", check.checkToken, driver.update);
// Delete a driver account logged
router.delete("/usersid", check.checkToken, driver.delete);
// delete all driver
router.delete("/users", driver.deleteAll);
//report a problem with an email
router.post("/users/report", check.checkToken, send.sendMail);
//Recovery password
router.post("/passwordReset", driver.recoveryPassword);
//Change account password
router.post("/users/changePassword", check.checkToken, driver.changePassword);



module.exports = router;