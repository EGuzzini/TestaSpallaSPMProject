
const express = require('express');
const router = express.Router();

const parkingslot = require("../controller/parkingController.js");

// Create a new Parking slot
router.post("/parking", parkingslot.create);
// Retrieve all Parking slots
router.get("/parking", parkingslot.findAll);

// Retrieve a single Parking slot with parkingId
router.get("/parking/:parkingId", parkingslot.findOne);

// Update a Customer with customerId
router.put("/parking/:parkingId", parkingslot.update);

// Delete a Customer with customerId
router.delete("/parking/:parkingId", parkingslot.delete);

// Create a new Customer
router.delete("/parking", parkingslot.deleteAll);

module.exports = router;