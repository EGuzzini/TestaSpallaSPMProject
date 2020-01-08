
const Parkingslot = require("../models/parkingModels.js");
const sql = require("../models/db.js");
exports.create = (req, res) => {

  /* prende il campo admin dal token per vedere se ha i diritti di accesso per creare i parcheggi
  if(req.decoded.admin==false){
    return res.status(401);
  }
  */
  console.log(req.decoded.iat + " admin");
  console.log("req.headers:  " + req.header('Authorization'));
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
    coord: req.body.coord,
    comune: req.body.comune,
    costoorario: req.body.costoorario
  });
  var xy = ps.coord.split(',');
  
  Parkingslot.findByPosition(xy[0],xy[1], (err, data) => {
    console.log(data+" ciao");
    if (data !== null) {
      res.status(404).send({
        message: `already exist a Parking with coord ${ps.coord} .`
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
  /* prende il campo admin dal token per vedere se ha i diritti di accesso per creare i parcheggi
  if(req.decoded.admin==false){
    return res.status(401);
  }
  */
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
  /* prende il campo admin dal token per vedere se ha i diritti di accesso per creare i parcheggi
  if(req.decoded.admin==false){
    return res.status(401);
  }
  */
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
  /* prende il campo admin dal token per vedere se ha i diritti di accesso per creare i parcheggi
  if(req.decoded.admin==false){
    return res.status(401);
  }
  */
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
  /* prende il campo admin dal token per vedere se ha i diritti di accesso per creare i parcheggi
  if(req.decoded.admin==false){
    return res.status(401);
  }
  */
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
  /* prende il campo admin dal token per vedere se ha i diritti di accesso per creare i parcheggi
  if(req.decoded.admin==false){
    return res.status(401);
  }
  */
  Parkingslot.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Parking slot."
      });
    else res.send({ message: `All Parking slot were deleted successfully!` });
  });
};