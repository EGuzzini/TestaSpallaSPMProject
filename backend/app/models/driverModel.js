const sql = require("./db.js");

// constructor campi della tabella parking slot del database
const Driver = function (d) {
    this.username = d.username;
    this.email = d.email;
    this.password = d.passwordhash;
    this.targhe = d.targhe;
};
//DA FINIRE
Driver.create = (newdriver, targa, result) => {
    console.log(newdriver, " newdriver")
    sql.query("INSERT INTO driver SET ?", newdriver, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null, { ...newdriver });
        console.log("created driver: ", { ...newdriver });

    });
};
Driver.addTarga = (email, targa, result) => {
    console.log({ targa })
    sql.query(`SELECT JSON_CONTAINS(targhe,'"${targa}"','$') as targa from DRIVER where  email ='${email}'`, (err, res) => {
        var esiste = res[0].targa
        if (esiste == 0) {
            sql.query(`update driver SET targhe=JSON_ARRAY_APPEND(targhe,'$',"${targa}") where email ='${email}'`, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                result(null, { ...res });
            })
        } else result(err, null);
    })
}

Driver.deleteTarga = (email, targa, result) => {
    sql.query(`update DRIVER SET targhe=Json_remove(targhe, replace(json_search(targhe, 'one', '${targa}'), '"', '')) where email ='${email}' and json_search(targhe, 'one', '${targa}')`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        result(null, { ...res });
    })
}
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
Driver.findByEmailOrUsername = (driveremail, driverusername, result) => {
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

    sql.query("UPDATE driver SET username = ?, email =  ?  WHERE idDriver = ?", [driver.username, driver.email, id],
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
Driver.updateByEmail = (email, driver, result) => {

    sql.query("UPDATE driver SET username = ?, password = ?  WHERE email = ?", [driver.username, driver.password, email],
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
Driver.updatePasswordById = (id, hashednewpassword, result) => {

    sql.query("UPDATE driver SET password = ?  WHERE idDriver = ?", [hashednewpassword, id],
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

            result(null, res);
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