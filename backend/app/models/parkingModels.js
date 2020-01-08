const sql = require("./db.js");


// constructor campi della tabella parking slot del database
const Parkingslot = function (ps) {

  this.status = ps.status;
  this.coord = ps.coord;
  this.comune = ps.comune;
  this.costoorario = ps.costoorario;
};

Parkingslot.create = (newparkingslot, result) => {
  sql.query("INSERT INTO parkingslot SET ?", newparkingslot, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created parking slot: ", { ...newparkingslot });
    result(null, { ...newparkingslot });
  });
};

Parkingslot.findById = (parkingId, result) => {
  sql.query(`SELECT * FROM parkingslot WHERE idparkingslot = ${parkingId}`, (err, res) => {
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

Parkingslot.findByPosition = (x,y, result) => {
 
  
  sql.query(`SELECT * FROM parkingslot WHERE SUBSTRING_INDEX(coord, ',', 1) =${x} AND SUBSTRING_INDEX(coord, ',', -1) =${y}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log(res.data + "  res");
    if (res.length) {
      console.log("found parking slot with position: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found parking slot with the id
    result({ kind: "not_found" }, null);
  });
};
Parkingslot.getAll = result => {
  sql.query("SELECT * FROM parkingslot", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("parking slots: ", res);
    result(null, res);
  });
};

Parkingslot.updateById = (id, parkingslot, result) => {
  sql.query(
    "UPDATE parkingslot SET status = ?, coord =? ,comune = ?, costoorario=? WHERE idparkingslot = ?",
    [parkingslot.status, parkingslot.coord, parkingslot.comune, parkingslot.costoorario, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found parking slot with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated parking slot: ", { ...parkingslot });
      result(null, { ...parkingslot });
    }
  );
};

Parkingslot.remove = (id, result) => {
  sql.query("DELETE FROM parkingslot WHERE idparkingslot = ?", id, (err, res) => {
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

    console.log("deleted parkingslot with id: ", id);
    result(null, res);
  });
};

Parkingslot.removeAll = result => {
  sql.query("DELETE FROM parkingslot", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} parkingslot`);
    result(null, res);
  });
};



module.exports = Parkingslot;
