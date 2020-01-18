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
        subject: mailData.subject,
        text: mailData.text + " from " + req.decoded.email
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.status(400); //error
        } else {
            res.status(200); //success
        }


    });
};

module.exports = {
    sendMail: sendMail
}