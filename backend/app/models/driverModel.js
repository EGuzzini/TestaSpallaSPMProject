const sql = require("./db.js");

// constructor campi della tabella parking slot del database
const Driver = function (d) {

    this.username = d.username;
    this.email = d.email;
    this.password = d.passwordhash;
};

Driver.create = (newdriver, result) => {
    sql.query("INSERT INTO driver SET ?", newdriver, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created driver: ", { ...newdriver });
        result(null, { ...newdriver });
    });
};

Driver.findById = (driverId, result) => {
    sql.query(`SELECT * FROM driver WHERE idDriver = ${driverId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found driver: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found parking slot with the id
        result({ kind: "not_found" }, null);
    });
};
Driver.findByEmailOrUsername = (driveremail,driverusername, result) => {
    sql.query(`SELECT * FROM driver WHERE email = '${driveremail}' OR username = '${driverusername}' `, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found driver with this email: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found driver with
      result({ kind: "not_found" }, null);
    });
  };

Driver.getAll = result => {
    sql.query("SELECT * FROM driver", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("drivers: ", res);
        result(null, res);
    });
};

Driver.updateById = (id, driver, result) => {
    sql.query(
        "UPDATE driver SET username = ? WHERE idDriver = ?",
        [driver.username, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found driver with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated driver: ", { ...driver });
            result(null, { ...driver });
        }
    );
};

Driver.remove = (id, result) => {
    sql.query("DELETE FROM driver WHERE idDriver = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found driver with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted driver with id: ", id);
        result(null, res);
    });
};

Driver.removeAll = result => {
    sql.query("DELETE FROM driver", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log(`deleted ${res.affectedRows} driver`);
        result(null, res);
    });
};



module.exports = Driver;
