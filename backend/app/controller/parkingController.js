
const Parkingslot = require("../models/parkingModels.js");

exports.create = (req, res) => {
  console.log("req.headers:  "+req.header('Authorization'));
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(req.body);
  // Create a Customer
  const ps = new Parkingslot({
    status: req.body.status,
    posx: req.body.posx,
    posy: req.body.posy,
    comune: req.body.comune,
    costoorario: req.body.costoorario
  });

  Parkingslot.findByPosition(ps.posx,ps.posy, (err, data) => {
    console.log(data);
     if (data !== null) {
      res.status(404).send({
        message: `already exist a Parking with posx ${ps.posx} and posy ${ps.posy} .`
      });
    } else {
      // Save Customer in the database
      Parkingslot.create(ps, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Driver."
          });
        else res.send(data);
      });
    }
  });


};

exports.findAll = (req, res) => {
  Parkingslot.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving parking slots."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Parkingslot.findById(req.params.parkingId, (err, data) => {

    console.log(req.params.parkingId + " parking id");
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Parking with id ${req.params.parkingId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Parking with id " + req.params.parkingId
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
  console.log(req.params.parkingId);
  

  Parkingslot.updateById(


    req.params.parkingId,
    new Parkingslot(req.body),
    (err, data) => {
      
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Parking slot with id ${req.params.parkingId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.params.parkingId
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  Parkingslot.remove(req.params.parkingId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Parking slot with id ${req.params.parkingId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Parking slot with id " + req.params.parkingId
        });
      }
    } else res.send({ message: `Parking slot was deleted successfully!` });
  });
};

exports.deleteAll = (req, res) => {
  Parkingslot.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Parking slot."
      });
    else res.send({ message: `All Parking slot were deleted successfully!` });
  });
};