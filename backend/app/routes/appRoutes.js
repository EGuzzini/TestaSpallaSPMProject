const express = require('express');
const router = express.Router();
const check = require("../controller/checkToken.js");
const parkingslot = require("../controller/parkingController.js");
const driver = require("../controller/driverController.js");
const send = require("../controller/mailSender.js");
const stripe = require("../controller/stripe.js");

//PROVA BOTTONE TRIGGER
router.post("/trigger",parkingslot.trigger);
//find parkingstore
router.post("/findstore",parkingslot.findParkstore)


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
router.get("/parkingnearest/:destination/:targa", check.checkToken, parkingslot.nearest);
// send notification to municipality police for unauthorized parking
//router.get("/parking/notification/:parkingId", check.checkToken, parkingslot.notification);// DA RIVEDERE
//cancellation of park reserved
router.get("/parkingnearest/cancellation/cancel/:park", check.checkToken, parkingslot.cancel);
//driver parked in designated area
router.get("/parking/parked/parkedslot", check.checkToken, parkingslot.parked);
//driver park occupied
router.get("/parking/parked/parkoccupied", check.checkToken, parkingslot.parktaken);
//possible park malfunction
router.get("/parking/parked/malfunction", check.checkToken, parkingslot.malfunction);

//----------Parking area-------------------------------------------
// create parking area
router.post("/parking/area", check.checkToken, parkingslot.createarea);
// Retrieve all Parking slots
router.get("/parkingarea", check.checkToken, parkingslot.findAllArea);
// Retrieve a single Parking slot with parkingId
router.get("/parking/area/:parkingareaId", check.checkToken, parkingslot.findOneArea);
// Update a Parking slot with parkingId
router.put("/parking/area/:parkingareaId", check.checkToken, parkingslot.updateArea);
// Delete a Parking slot with parkingId
router.delete("/parking/area/:parkingareaId", check.checkToken, parkingslot.deleteArea);
// delete all parking slots
router.delete("/parkingarea", check.checkToken, parkingslot.deleteAllArea);


// routes for driver
//create a new user
router.post("/register", driver.create);
//login route
router.post("/login", driver.login)
//get all users
router.get("/users", driver.findAll);
// Retrieve a single driver with Id
router.get("/users/:driverId", driver.findOne);
// Retrieve a single driver with Id
router.get("/users/find/find", check.checkToken, driver.findDriver);
// Update a driver with driverId
router.put("/users/:driverId", check.checkToken, driver.update);
//update by email
router.post("/users/update/update", check.checkToken, driver.updateByEmail);
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
//add targa
router.post("/users/add/addtarga", check.checkToken, driver.addTarga)
//delete targa
router.post("/users/delete/deletetarga", check.checkToken, driver.deleteTarga)


//STRIPE Route
router.post("/webhook",stripe.webhook)
router.post("/park/payment",stripe.create_payment_intent)

module.exports = router;