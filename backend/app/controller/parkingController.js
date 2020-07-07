const Parkingslot = require("../models/parkingModels.js");
const Parkingarea = require("../models/parkingareaModel");
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
  // Create a parkingslot
  const ps = new Parkingslot({
    status: req.body.status,
    coord: req.body.coord,
    comune: req.body.comune,
    costoorario: req.body.costoorario
  });
  var xy = ps.coord.split(',');
  Parkingslot.findByPosition(xy[0], xy[1], (err, data) => {
    if (data !== null) {
      res.status(404).send({
        message: `already exist a Parking with coord ${ps.coord} .`
      });
    } else {
      // Save parking slot in the database
      Parkingslot.create(ps, (err, data) => {
        if (err)
          res.status(500).send({
            message: err.message || "Some error occurred while creating the Parking slot."
          });
        else res.send(data);
      });
    }
  });
};

//da inserire il controllo per il parcheggio libero
exports.nearest = (req, res) => {
  //chiamata alla funzione del model per il parcheggio più vicino

  var destination = req.params.destination;
  var targa = req.params.targa
  console.log("targa ", targa)
  var coordparcheggi;
  var indicipark = "";
  Parkingslot.getAll((err, data) => {
    Parkingarea.findliberi(targa, (err, dataArea) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving parking areas."
        });
      }
      else {
        console.log({ dataArea })

        const dest = LatLon.parse(destination);
        //calcola la distanza tra le coordinate con l'utilizzo di una funzione geodesiana, se si trova nel raggio di 1000 metri dalla destinazione ed è disponibile allora viene restituito
        var distanza = distanzaMinima(data, dataArea, dest)
        coordparcheggi = distanza.coordparcheggiCinque
        indicipark = distanza.indici
        if (coordparcheggi.length == 0) {
          return res.status(404).send({
            message: `not found a free park .`
          });
        }
        //imposta la stringa correttamente per l'API di mapbox
        coordparcheggi = coordparcheggi.join(';');
        console.log(coordparcheggi + " 1000 metri")
        indicipark = indicipark.join(';');

      }
      const options = {
        url: 'https://api.mapbox.com/directions-matrix/v1/mapbox/walking/' + destination + ';' + coordparcheggi + '?sources=' + indicipark + '&destinations=0&access_token=pk.eyJ1Ijoid2lsbGlhbTk2IiwiYSI6ImNrNTN3YXJ2MDBidWIzZ2s2cWpubHhwcG0ifQ.bUTnoo7Hqb193F8MthF0uw',
        method: 'GET',
        json: true
      };
      //richiesta all'API tramite modulo REQUEST 
      request(options, function (err, body) {
        console.log(body.body)
        //ritorna la location della source che ha durata minore
        var array = body.body.durations.map(v => v[0])
        console.table({ array })
        var minimo = Math.min.apply(null, array);
        const indiceMin = array.indexOf(minimo);
        var location = body.body.sources[indiceMin].location
        Parkingslot.findByPosition(location[0], location[1], (err, data) => {
          if (data == null) {
            //caso parking area
            Parkingarea.findByPosition(body.body.sources[indiceMin].location[0], body.body.sources[indiceMin].location[1], (err, result) => {
              console.log(body.body.sources[indiceMin].location[0] + "," + body.body.sources[indiceMin].location[1])
              console.log({ result })
              if (result == null) {
                res.status(404).send({
                  message: err.message || "not found parking area"
                });
              } else {
                Parkingarea.addPrenotazione(result.idparkingarea, targa, (err, data) => {
                  if (err) {
                    res.status(500).send({
                      message: "Error updating Parking slot with id "
                    });
                  } else {

                    var park = {
                      "coordinate": body.body.sources[indiceMin].location[0] + ',' + body.body.sources[indiceMin].location[1],
                      "id": result.idparkingarea
                    }
                    console.log(park)
                    res.send(park);
                  }
                })
              }
            })


          } else {//caso parcheggio singolo
            parcheggio = new Parkingslot(data);
            parcheggio.status = 1;
            parcheggio.emailDriver = req.decoded.email
            parcheggio.targaveicolo = targa
            Parkingslot.updateById(data.idparkingslot, parcheggio,
              (err, datachanged) => {
                if (err) {
                  if (err.kind === "not_found") {
                    res.status(404).send({
                      message: `Not found Parking slot with id.`
                    });
                  } else {
                    res.status(500).send({
                      message: "Error updating parking with id "
                    });
                  }
                } else {
                  var park = {
                    "coordinate": body.body.sources[indiceMin].location[0] + ',' + body.body.sources[indiceMin].location[1],
                    "id": data.idparkingslot
                  }
                  console.log(park)
                  res.send(park);
                }

              }
            );
          }
        });

      });
    });
  })
}




/**
 * calcola la distanza tra le coordinate con l'utilizzo
 * di una funzione geodesiana, se si trova nel raggio di 1000 metri dalla destinazione ed è disponibile allora viene restituito
 */
distanzaMinima = (data, dataArea, dest, res) => {
  count = 0;
  var indici = [];
  var coordparcheggiCinque = []
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      const p2 = LatLon.parse(data[key].coord);
      const d = LatLon.distanceTo(dest, p2)
      if (d < 1000 && data[key].status == 0) {
        coordparcheggiCinque.push(data[key].coord);
        count++;
        indici.push(count);
      }
    }
  }
  for (var key in dataArea) {
    if (data.hasOwnProperty(key)) {
      const p2 = LatLon.parse(dataArea[key].coordinate);
      const d = LatLon.distanceTo(dest, p2)
      if (d < 1000) {
        coordparcheggiCinque.push(dataArea[key].coordinate);
        count++;
        indici.push(count);
      }
    }
  }

  return { coordparcheggiCinque, indici }
}
// in base all'email del conducente trova il parcheggio prenotato, se risulta occupato lo scenario termina e risponde ok,
// se invece è 1 allora risponde errore perchè potrebbe aver sbagliato parcheggio

exports.parked = (req, res) => {
  Parkingslot.findbyemail(req.decoded.email, (err, data) => {
    console.log("parked data ", data)
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Parking with email ${req.decoded.email}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Parking with id " + req.decoded.email
        });
      }
    }
    if (data.status == 2) {
      res.send().status(200);
    } else {
      send.notifyMalfunction([data.idparkingslot, data.coord])
      parcheggio = new Parkingslot(data);
      parcheggio.emailDriver = null;
      parcheggio.targaveicolo = null;
      parcheggio.status = 3;
      Parkingslot.updateById(data.idparkingslot, parcheggio,
        (err, result) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Parking slot with id ${data.idparkingslot}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating Parking slot with id " + data.idparkingslot
              });
            }

          }
        });
      res.status(302).send({
        message: `controllare parcheggio.`
      });
    }
  })
}

/**
 * il conducente trova il suo parcheggio occupato
 * controllo che lo status del suo parcheggio sia 2 e invio la notifica alle forze dell'ordine
 * 
 */
exports.parktaken = (req, res) => {
  Parkingslot.findbyemail(req.decoded.email, (err, data) => {
    console.log("parked data ", data)
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Parking with email ${req.decoded.email}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Parking with id " + req.decoded.email
        });
      }
    }
    if (data.status == 2) {
      parcheggio = new Parkingslot(data);
      parcheggio.emailDriver = null;
      parcheggio.targaveicolo = null;
      Parkingslot.updateById(data.idparkingslot, parcheggio,
        (err, result) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Parking slot with id ${data.idparkingslot}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating Parking slot with id " + data.idparkingslot
              });
            }

          } else { //N.B. non aspetta la risposta dell'email
            send.notification([data.idparkingslot, data.coord])
            res.send().status(200);
          }
        });
    } else {
      res.status(302).send({
        message: `controllare parcheggio.`
      });
    }
  })
}

exports.malfunction = (req, res) => {
  Parkingslot.findbyemail(req.decoded.email, (err, data) => {
    console.log("parked data ", data)
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Parking with email ${req.decoded.email}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Parking with id " + req.decoded.email
        });
      }
    } else {
      send.notifyMalfunction([data.idparkingslot, data.coord])
      res.send().status(200);
    }
  })
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
  Parkingslot.updateById(req.params.parkingId, new Parkingslot(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: 'Not found Parking slot with id ${req.params.parkingId}.'
        });
      } else {
        res.status(500).send({
          message: "Error updating Parking slot with id " + req.params.parkingId
        });
      }
    } else res.send(data);
  });
};

exports.cancel = (req, res) => {
  /* prende il campo admin dal token per vedere se ha i diritti di accesso per creare i parcheggi
  if(req.decoded.admin==false){
    return res.status(401);
  }
  */
  var xy = req.params.park.split(',');
  Parkingslot.findByPosition(xy[0], xy[1], (err, data) => {
    if (data == null) {
      res.status(400).send({
        message: `park not found .`
      });
    } else {
      if (data.status == 3) {
        return res.send().status(200);
      }
      parcheggio = new Parkingslot(data);
      parcheggio.status = 0;
      parcheggio.emailDriver = null;
      parcheggio.targaveicolo = null;
      Parkingslot.updateById(data.idparkingslot, parcheggio,
        (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Parking slot with id ${req.params.parkingId}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating Parking slot with id " + req.params.parkingId
              });
            }
          } else res.send(data);
        });
    }
  });
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

//-------------PARKING AREA CONTROLLER------------

exports.createarea = (req, res) => {
  console.trace()
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  // Create a parking area
  const pa = new Parkingarea({
    nomeparcheggio: req.body.nomeparcheggio,
    coordinate: req.body.coordinate,
    comune: req.body.comune,
    prenotazioni: '[]'
  });
  var xy = pa.coordinate.split(',');
  Parkingarea.findByPosition(xy[0], xy[1], (err, data) => {
    console.log(JSON.stringify(data) + " ciao");
    if (data !== null) {
      res.status(404).send({
        message: `already exist a Parking with coord ${pa.coordinate} .`
      });
    } else {
      // Save parking area in the database
      Parkingarea.create(pa, (err, data) => {
        if (err)
          res.status(500).send({
            message: err.message || "Some error occurred while creating the area."
          });
        else res.send(data);
      });
    }
  });
};

exports.findAllArea = (req, res) => {
  Parkingarea.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving parking slots."
      });
    else res.send(data);
  });
};

exports.findOneArea = (req, res) => {
  Parkingarea.findById(req.params.parkingareaId, (err, data) => {
    console.log(req.params.parkingareaId + " parkingarea Id ");
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Parking with id ${req.params.parkingareaId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Parking with id " + req.params.parkingareaId
        });
      }
    } else res.send(data);
  });
};


exports.updateArea = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(req.params.parkingareaId);
  Parkingarea.updateById(req.params.parkingareaId, new Parkingarea(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Parking area with id ${req.params.parkingId}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating Parking area with id " + req.params.parkingareaId
        });
      }
    } else res.send(data);
  });
};


exports.cancelArea = (req, res) => {
  var xy = req.params.park.split(',');
  Parkingarea.findByPosition(xy[0], xy[1], (err, data) => {
    if (data == null) {
      res.status(400).send({
        message: `park not found .`
      });
    } else {
      Parkingarea.deletePrenotazione(data.idparkingarea, req.body.targa,
        (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Parking area with id ${req.params.parkingId}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating Parking area with id " + req.params.parkingId
              });
            }
          } else res.send(data);
        });
    }
  });
};


exports.deleteArea = (req, res) => {
  Parkingarea.remove(req.params.parkingareaId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Parking area with id ${req.params.parkingareaId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Parking area with id " + req.params.parkingareaId
        });
      }
    } else res.send({ message: `Parking area was deleted successfully!` });
  });
};

exports.deleteAllArea = (req, res) => {
  Parkingarea.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Parking areas."
      });
    else res.send({ message: `All Parking areas were deleted successfully!` });
  });
};