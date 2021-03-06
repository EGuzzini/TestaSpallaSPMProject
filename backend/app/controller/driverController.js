const bcrypt = require("bcrypt");
const saltRounds = 10;
const Driver = require("../models/driverModel.js");
const jwt = require("jsonwebtoken");
const config = require("../../config.js")
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");

exports.checkTokenInit = (req, res) => {
    res.send().status(200)
}
exports.create = (req, res) => {
    console.log("req body :  " + req.body.username);
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            throw err
        } else {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if (err) {
                    throw err
                } else {
                    const d = new Driver({
                        username: req.body.username,
                        email: req.body.email,
                        passwordhash: hash
                    });
                    Driver.findByEmailOrUsername(d.email, d.username, (err, data) => {
                        console.log(data);
                        if (data !== null) {
                            res.status(404).send({
                                message: `already exist a driver with email ${d.email} or this username: ${d.username} .`
                            });
                        } else {
                            // Save Driver in the database
                            Driver.create(d, (err, data) => {
                                if (err) {
                                    res.status(500).send({
                                        message: err.message || "Some error occurred while creating the Driver."
                                    });
                                } else res.send(data).status(200);
                            });
                        }
                    });
                }
            })
        }
    })

};


exports.login = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    let getDriver;
    Driver.findByEmailOrUsername("", req.body.username, (err, driver) => {
        console.log(JSON.stringify(driver) + "   username ");
        if (!driver) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        getDriver = driver;
        return bcrypt.compare(req.body.password, driver.password, (err, response) => {
            if (!response) {
                return res.status(401).json({ error: "Authentication failed" });
            }
            console.log(response);
            let jwtToken = jwt.sign({
                email: driver.email,
                driverId: driver.idDriver,
                admin: false
            }, config.secret, {
                expiresIn: "20m"
            });
            res.status(200).json({
                jwtToken
            });
        })
    });
}

exports.findAll = (req, res) => {
    Driver.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving drivers."
            });
        else res.send(data);
    });
};

exports.findOne = (req, res) => {
    Driver.findById(req.params.driverId, (err, data) => {

        console.log(req.params.driverId + " driver id");
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found driver with id ${req.params.driverId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving driver with id " + req.params.driverId
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
    console.log(req.params.driverId);
    Driver.updateById(req.params.driverId, new Driver(req.body), (err, data) => {

        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Driver with id ${req.params.driverId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error updating Driver with id " + req.params.driverId
                });
            }
        } else res.send(data);
    });
};

//cancella l'account del driver prendendo il driverId dal token 
exports.delete = (req, res) => {
    console.log(req.decoded.driverId + " id driver token")
        /* prende il campo admin dal token per vedere se ha i diritti di accesso per creare i parcheggi
        if(req.decoded.admin==false){
          return res.status(401);
        }
        */
    Driver.remove(req.decoded.driverId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Parking slot with id ${req.decoded.driverId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete driver with id " + req.decoded.driverId
                });
            }
        } else res.send({ message: `driver was deleted successfully!` });
    });
};

exports.deleteAll = (req, res) => {
    Driver.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while removing all drivers."
            });
        else res.send({ message: `All drivers were deleted successfully!` });
    });
};
exports.changePassword = (req, res) => {

    let password = { oldPassword: req.body.oldpassword, newPassword: req.body.newpassword };
    Driver.findByEmailOrUsername(req.decoded.email, null, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found driver .`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving driver"
                });
            }
        } else {
            bcrypt.genSalt(saltRounds, function(err, salt) {
                if (err) {
                    throw err
                } else {
                    bcrypt.compare(password.oldPassword, data.password, (err, response) => {

                        if (!response) {
                            res.status(401).json({
                                message: "The old password is wrong"
                            });
                        } else {
                            bcrypt.genSalt(saltRounds, function(err, salt) {
                                if (err) {
                                    throw err
                                } else {

                                    bcrypt.hash(req.body.newpassword, salt, function(err, hash) {
                                        if (err) {
                                            throw err
                                        } else {
                                            const hashednewpassword = hash;

                                            const d = new Driver({
                                                username: data.username,
                                                email: data.email,
                                                passwordhash: hashednewpassword
                                            });

                                            Driver.updatePasswordById(
                                                req.decoded.driverId,
                                                hashednewpassword,
                                                (err, data) => {

                                                    if (err) {
                                                        if (err.kind === "not_found") {
                                                            res.status(404).send({
                                                                message: `Not found Driver with id` + data.idDriver
                                                            });
                                                        } else {
                                                            res.status(500).send({
                                                                message: "Error updating Driver with id " + data.idDriver
                                                            });
                                                        }
                                                    } else res.send(data);
                                                }
                                            );
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.recoveryPassword = (req, res) => {

    Driver.findByEmailOrUsername(req.body.email, req.body.email, (err, driver) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found driver with id ${driver.idDriver}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving driver with id " + driver.idDriver
                });
            }
        } else {
            getDriver = driver;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                if (err) {
                    throw err
                } else {
                    let newpassword = randomstring.generate({
                        length: 8,
                        charset: 'alphabetic'
                    });
                    bcrypt.hash(newpassword, salt, function(err, hash) {
                        if (err) {
                            throw err
                        } else {
                            const hashednewpassword = hash;
                            const d = new Driver({
                                username: getDriver.username,
                                email: getDriver.email,
                                passwordhash: hashednewpassword
                            });

                            Driver.updatePasswordById(
                                getDriver.idDriver,
                                hashednewpassword,
                                (err, data) => {

                                    if (err) {
                                        if (err.kind === "not_found") {
                                            res.status(403).send({
                                                message: `Not found Driver with id ${getDriver.idDriver}.`
                                            });
                                        } else {
                                            res.status(501).send({
                                                message: "Error updating Driver with id " + getDriver.idDriver
                                            });
                                        }
                                    } else {
                                        let mailData = { subject: "Nuova password", text: "La tua nuova password è: " };
                                        let transporter = nodemailer.createTransport({
                                            service: 'gmail',
                                            auth: {
                                                user: 'smartparkingNoreplyTestaspalla@gmail.com',
                                                pass: 'Smartparking'
                                            }
                                        });
                                        let mailOptions = {
                                            from: 'smartparkingNoreplyTestaspalla@gmail.com',
                                            to: d.email,
                                            subject: mailData.subject,
                                            text: mailData.text + newpassword
                                        };
                                        transporter.sendMail(mailOptions, function(error, info) {
                                            if (error) {
                                                res.status(400); //error
                                            } else {
                                                res.send(data).status(200); //success
                                            }


                                        });

                                    }
                                }


                            );

                        }
                    });
                }

            });
        }
    });

};