const sql = require("./db.js");

// constructor campi della tabella parking slot del database
const Parkingarea = function (pa) {

  this.nomeparcheggio = pa.nomeparcheggio
  this.coordinate = pa.coordinate
  this.comune = pa.comune
  this.prenotazioni = pa.prenotazioni

};




Parkingarea.create = (newparkingarea, result) => {
  sql.query("INSERT INTO parkingarea SET ?", newparkingarea, (err, res) => {
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
  sql.query(`SELECT * FROM parkingarea WHERE SUBSTRING_INDEX(coordinate, ',', 1) =${x} AND SUBSTRING_INDEX(coordinate, ',', -1) =${y}`, (err, res) => {
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
    "UPDATE parkingarea SET nomeparcheggio = ?, coordinate =?, comune=? WHERE idparkingarea = ?",
    [parkingarea.nomeparcheggio, parkingarea.coordinate, parkingarea.comune, id],
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

Parkingarea.addPrenotazione = (idArea, targa, result) => {
  console.log({ targa })
  sql.query(`SELECT JSON_CONTAINS(prenotazioni,'"${targa}"','$') as prenotazioni from parkingarea where  idparkingarea ='${idArea}'`, (err, res) => {
    var esiste = res[0].prenotazioni
    console.log({ esiste })
    if (esiste == 0) {
      sql.query(`update parkingarea SET prenotazioni=JSON_ARRAY_APPEND(prenotazioni,'$','${targa}') where idparkingarea ='${idArea}'`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        result(null, { ...res });
      })
    } else {
      
      result(null,{ esiste })
    }
  })
}

Parkingarea.deletePrenotazione = (idArea, targa, result) => {
  sql.query(`update parkingarea SET prenotazioni=Json_remove(prenotazioni, replace(json_search(prenotazioni, 'one', '${targa}'), '"', '')) where idparkingarea ='${idArea}' and json_search(prenotazioni, 'one', '${targa}')`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { ...res });
  })
}

Parkingarea.remove = (id, result) => {
  console.log({ id })
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

Parkingarea.findbytarga = (targa, result) => {
  sql.query(`SELECT * FROM parkingarea WHERE JSON_CONTAINS(prenotazioni,'"${targa}"','$')=true`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found parking slot: ", res[0]);
      result(null, res);
      return;
    }
    // not found parking slot with the id
    result({ kind: "not_found" }, null);
  })
}

Parkingarea.findprenotazione = (targa,x, y, result) => {
  console.log({x},{y})
  sql.query(`SELECT * FROM parkingarea WHERE SUBSTRING_INDEX(coordinate, ',', 1) =${x} AND SUBSTRING_INDEX(coordinate, ',', -1) =${y}  and JSON_CONTAINS(prenotazioni,'"${targa}"','$')=true `, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found parking slot: ", res[0]);
      result(null, res);
      return;
    }
    // not found parking slot with the id
    result({ kind: "not_found" }, null);
  })
}
Parkingarea.findliberi = (targa, result) => {
  sql.query(`SELECT * FROM parkingarea WHERE JSON_CONTAINS(prenotazioni,'"${targa}"','$')=false`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found parking slot: ", res[0]);
      result(null, res);
      return;
    }
    // not found parking slot with the id
    result({ kind: "not_found" }, null);
  })
}
module.exports = Parkingarea;
