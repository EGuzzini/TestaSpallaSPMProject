const nodemailer = require('nodemailer');

let sendMail = (req, res) => {


    let mailData = { subject: req.body.subject, text: req.body.text };
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'smartparkingNoreplyTestaspalla@gmail.com',
            pass: 'Smartparking'
        }
    });

    let mailOptions = {
        from: 'smartparkingNoreplyTestaspalla@gmail.com',
        to: 'dante.domizi@studenti.unicam.it',
        subject: "mailData.subject",
        text: mailData.text + " from " + req.decoded.email
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(400); //error
        } else {
            res.status(200); //success
        }
    });
};
let notification = (req, res) => {

    //let mailData = { subject: req.body.subject, text: req.body.text };
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'smartparkingNoreplyTestaspalla@gmail.com',
            pass: 'Smartparking'
        }
    });

    let mailOptions = {
        from: 'smartparkingNoreplyTestaspalla@gmail.com',
        to: 'william.taruschio@studenti.unicam.it',
        // to: 'dante.domizi@studenti.unicam.it',
        subject: "AVVISO CONTROLLO PARCHEGGIO ",
        text: "il parcheggio numero " + req[0] + " alla posizione " + req[1] + " è stato occupato abusivamente, si prega di controllare"
    };
    console.log("request nodemailer ", req);
    console.log("response nodemailer ", res);

    let info = transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            //    console.log('Message sent: ' + info.response);
            return
        }

    });

};
let notifyMalfunction = (req, res) => {

    //let mailData = { subject: req.body.subject, text: req.body.text };
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'smartparkingNoreplyTestaspalla@gmail.com',
            pass: 'Smartparking'
        }
    });

    let mailOptions = {
        from: 'smartparkingNoreplyTestaspalla@gmail.com',
        to: 'emanuele01.guzzini@studenti.unicam.it',
        // to: 'dante.domizi@studenti.unicam.it',
        subject: "AVVISO CONTROLLO PARCHEGGIO GUASTO ",
        text: "il parcheggio numero " + req[0] + "alla posizione " + req[1] + " potrebbe essere guasto, si prega di controllare"
    };
    console.log("request nodemailer ", req);
    console.log("response nodemailer ", res);

    let info = transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            //    console.log('Message sent: ' + info.response);
            return
        }

    });

};
module.exports = {
    sendMail: sendMail,
    notification: notification,
    notifyMalfunction: notifyMalfunction
}