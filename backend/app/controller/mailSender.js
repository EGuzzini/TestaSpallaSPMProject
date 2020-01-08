const nodemailer = require('nodemailer');

let sendMail = (req, res) => {
    /*
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    let decoded = jwtDecode(token);
    console.log('------------------------------------');
    console.log(decoded.email);
    console.log('------------------------------------');
    */

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
        subject: mailData.text,
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