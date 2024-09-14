var nodemailer = require("nodemailer");

const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_AUTH_USER = process.env.EMAIL_AUTH_USER;
const EMAIL_AUTH_PASS = process.env.EMAIL_AUTH_PASS;

var transport = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    port: 465, // port for secure SMTP
    secure: true, // true for 465, false for other ports
    auth: {
        user: EMAIL_AUTH_USER,
        pass: EMAIL_AUTH_PASS
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

export const sendEmail = (email, emailBody, subject) => {
    var mailOptions = {
        to: email,
        from: `Set2Score<${EMAIL_FROM}>`,
        subject: subject,
        html: emailBody
    };

    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions).then((result) => {
            resolve(true);
        }).catch(err => {
            console.log(err);
        })
    })
};