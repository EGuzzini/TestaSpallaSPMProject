const bcrypt = require("bcrypt");
const saltRounds = 10;
const Driver = require("../models/driverModel.js");

let passwordhash = "";
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      throw err
    } else {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (err) {
          throw err
        } else {
          const d = new Driver({
            username: req.body.username,
            email: req.body.email,
            passwordhash: hash
          });
          Driver.findByEmailOrUsername(d.email, d.username, (err, data) => {
            console.log(data);
            if (data !== null) {
              res.status(404).send({
                message: `already exist a driver with email ${d.email} or this username: ${d.username} .`
              });
            } else {
              // Save Driver in the database
              Driver.create(d, (err, data) => {
                if (err)
                  res.status(500).send({
                    message:
                      err.message || "Some error occurred while creating the Driver."
                  });
                else res.send(data).status(200);
              });
            }
          });
        }
      })
    }
  })




};
exports.findAll = (req, res) => {
  Driver.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving drivers."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Driver.findById(req.params.driverId, (err, data) => {

    console.log(req.params.driverId + " driver id");
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found driver with id ${req.params.driverId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving driver with id " + req.params.driverId
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(req.params.driverId);


  Driver.updateById(


    req.params.driverId,
    new Driver(req.body),
    (err, data) => {

      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Driver with id ${req.params.driverId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Driver with id " + req.params.driverId
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  Driver.remove(req.params.driverId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Parking slot with id ${req.params.driverId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete driver with id " + req.params.driverId
        });
      }
    } else res.send({ message: `driver was deleted successfully!` });
  });
};

exports.deleteAll = (req, res) => {
  Driver.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all drivers."
      });
    else res.send({ message: `All drivers were deleted successfully!` });
  });
};