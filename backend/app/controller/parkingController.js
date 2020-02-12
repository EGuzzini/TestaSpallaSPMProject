const Parkingslot = require("../models/parkingModels.js");
const request = require('request');
const LatLon = require('../../node_modules/geodesy/latlon-spherical.js');
const send = require("../controller/mailSender.js");
exports.create = (req, res) => {

  /* prende il campo admin dal token per vedere se ha i diritti di accesso per creare i parcheggi
  if(req.decoded.admin==false){
    return res.status(401);
  }
  */
  console.log("req.headers:  " + req.header('Authorization'));
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  // Create a Customer
  const ps = new Parkingslot({
    status: req.body.status,
    coord: req.body.coord,
    comune: req.body.comune,
    costoorario: req.body.costoorario
  });
  var xy = ps.coord.split(',');
  console.log('------------------------------------');
  console.log(xy);
  console.log('------------------------------------');
  Parkingslot.findByPosition(xy[0], xy[1], (err, data) => {
    console.log(data + " ciao");
    if (data !== null) {
      res.status(404).send({
        message: `already exist a Parking with coord ${ps.coord} .`
      });
    } else {
      // Save Customer in the database
      Parkingslot.create(ps, (err, data) => {
        if (err)
          res.status(500).send({
            message: err.message || "Some error occurred while creating the Driver."
          });
        else res.send(data);
      });
    }
  });


};
//da inserire il controllo per il parcheggio libero
exports.nearest = (req, res) => {
  //chiamata alla funzione del model per il parcheggio più vicino
  //var destination = "13.075009882450104,43.13747491759089";
  var destination = req.params.destination;
  Parkingslot.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving parking slots."
      });
    else {
      count = 0;
      var indici = [];
      var coordparcheggiCinque = []
      const dest = LatLon.parse(destination);
      //calcola la distanza tra le coordinate con l'utilizzo di una funzione geodesiana, se si trova nel raggio di 1000 metri dalla destinazione ed è disponibile allora viene restituito
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          const p2 = LatLon.parse(data[key].coord);
          console.log(p2)
          const d = LatLon.distanceTo(dest, p2)
          console.log(d)
          if (d < 1000 && data[key].status != 1) {
            coordparcheggiCinque.push(data[key].coord);
            count++;
            indici.push(count);
          }
        }
      }
      if (coordparcheggiCinque.length == 0) {
        res.status(404).send({
          message: `not found a free park .`
        });
      }
      coordparcheggiCinque = coordparcheggiCinque.join(';');
      console.log(coordparcheggiCinque + " 1000 metri")
      indici = indici.join(';');
      const options = {
        url: 'https://api.mapbox.com/directions-matrix/v1/mapbox/walking/' + destination + ';' + coordparcheggiCinque + '?sources=' + indici + '&destinations=0&access_token=pk.eyJ1Ijoid2lsbGlhbTk2IiwiYSI6ImNrNTN3YXJ2MDBidWIzZ2s2cWpubHhwcG0ifQ.bUTnoo7Hqb193F8MthF0uw',
        method: 'GET',
        json: true
      };
      //richiesta all'API tramite modulo REQUEST 
      request(options, function (err, body) {
        console.log(body.body)
        //res.send(body);
        //ritorna la location della source che ha durata minore
        var array = [];
        for (var key in body.body.durations) {
          if (body.body.durations.hasOwnProperty(key)) {
            array.push(body.body.durations[key][0]);
          }
        }
        var minimo = Math.min.apply(null, array);
        var indiceMin = array.indexOf(minimo);
        //                console.log(body.body.sources[indiceMin].location); //questo
        res.send(body.body.sources[indiceMin].location);

      });
    }


  });

}


exports.findAll = (req, res) => {
  /* prende il campo admin dal token per vedere se ha i diritti di accesso per creare i parcheggi
  if(req.decoded.admin==false){
    return res.status(401);
  }
  */
  Parkingslot.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving parking slots."
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

//simula il cambio di status del parcheggio a occupato, se il parcheggio non era prenotato invia una notifica alla polizia municipale
exports.notification = (req, res) => {
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
    }
   
    if (data.status == 0) {
      send.notification(req.params.parkingId);
    }
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
        message: err.message || "Some error occurred while removing all Parking slot."
      });
    else res.send({ message: `All Parking slot were deleted successfully!` });
  });
};