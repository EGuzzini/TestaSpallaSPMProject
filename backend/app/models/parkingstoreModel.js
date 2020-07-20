const sql = require("./db.js");
const moment = require('moment')
// constructor campi della tabella parking slot del database
const Parkingstore = function (ps) {

  this.idpark = ps.idpark;
  this.idclient = ps.idpark;
  this.startdate = ps.idpark;
  this.enddate = ps.idpark;
  this.costoora = ps.idpark;

};
Parkingstore.findById = (storeId, result) => {
  sql.query(`SELECT * FROM parkingstore WHERE idparkStore = ${storeId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found parking slot: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found parking slot with the id
    result({ kind: "not_found" }, null);
  });
};
Parkingstore.findByIdParkClient = (parkingId, clientId, result) => {
  sql.query(`SELECT * FROM parkingstore WHERE idPark = ${parkingId}  OR emailClient= '${clientId}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found parking slot: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found parking slot with the id
    result({ kind: "not_found" }, null);
  });
};

Parkingstore.createStartPark = (idpark, email, costoora, result) => {
  let start = moment().format('YYYY-MM-DD hh:mm:ss')
  sql.query(`INSERT INTO parkingstore SET idPark = ?, emailClient= ?,startDate=? ,costoOra= ?`, [idpark, email, start, costoora], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created start park: ", { ...{ idpark, email } });
    result(null, { ...{ idpark, email } });
  });
};

Parkingstore.endPark = (idpark, email, _result) => {
  let end = moment().format('YYYY-MM-DD hh:mm:ss')
  sql.query(`SELECT * FROM parkingstore WHERE idPark = ${idpark} and emailClient ='${email}' and endDate IS NULL`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      _result(err, null);
      return;
    }
    if (res.length) {
      console.log(res[0].startDate + ' ciao')
      var start = res[0].startDate;
      var costoOra = res[0].costoOra
      var secondi = (moment(end, 'YYYY-MM-DD hh:mm:ss')).diff(moment(start, 'YYYY-MM-DD hh:mm:ss'), 'seconds')
      var costo = +((costoOra / 3600) * secondi).toFixed(2)
      sql.query(`UPDATE parkingstore SET endDate=?, daPagare=? WHERE idPark = ? AND emailClient =? AND endDate IS NULL `, [end, costo, idpark, email], (err, res) => {
        if (err) {
          console.log("error: ", err);
          _result(err, null);
          return;
        }
        console.log("updated endDate : ", { ...{ end, idpark, email } });
        _result(null, { ...{ end, idpark, email } });
      });
    }
  });

};

module.exports = Parkingstore;