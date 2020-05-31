const sql = require("./db.js");

// constructor campi della tabella parking slot del database
const Parkingarea = function (pa) {

 this.nomeparcheggio=pa.nomeparcheggio
  this.coordinate = pa.coordinate;
  this.postitotali = pa.postitotali;
  this.postidisponibili = pa.postidisponibili;
  this.prenotazioni = pa.prenotazioni

};




Parkingarea.create = (newparkingarea, result) => {
  sql.query("INSERT INTO parkingslot SET ?", newparkingarea, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created parking slot: ", { ...newparkingarea });
    result(null, { ...newparkingarea });
  });
};

Parkingarea.findById = (parkingId, result) => {
  sql.query(`SELECT * FROM parkingarea WHERE idparkingarea = ${parkingId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found parking area: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found parking slot with the id
    result({ kind: "not_found" }, null);
  });
};


Parkingarea.findByPosition = (x, y, result) => {
  sql.query(`SELECT * FROM parkingarea WHERE SUBSTRING_INDEX(coord, ',', 1) =${x} AND SUBSTRING_INDEX(coord, ',', -1) =${y}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log(res.data + "  res");
    if (res.length) {
      console.log("found parking area with position: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found parking slot with the id
    result({ kind: "not_found" }, null);
  });
};

Parkingarea.getAll = (result) => {
  sql.query("SELECT * FROM parkingarea", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("parking area: ", res);
    result(null, res);
  });
};

Parkingarea.updateById = (id, parkingarea, result) => {
  sql.query(
    "UPDATE parkingarea SET nomeparcheggio = ?, coordinate =? ,postitotali=?,postidisponibili=? WHERE idparkingarea = ?",
    [parkingarea.nome, parkingarea.coordinate, parkingarea.postitotali, parkingarea.postidisponibili, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result({ kind: "not_found" }, err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found parking slot with the id
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated parking slot: ", { ...parkingarea });
      result(null, { ...parkingarea });
    }
  );
};

Parkingarea.remove = (id, result) => {
  sql.query("DELETE FROM parkingarea WHERE idparkingarea = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found parkingslot with the id
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("deleted parkingarea with id: ", id);
    result(null, res);
  });
};

Parkingarea.removeAll = result => {
  sql.query("DELETE FROM parkingarea", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} parkingarea`);
    result(null, res);
  });
};

module.exports = Parkingarea;
