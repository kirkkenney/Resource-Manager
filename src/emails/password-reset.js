const nodemailer = require('nodemailer')

const sendEmail = (userEmail, token) => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: userEmail,
        subject: 'Password Reset',
        html: `<h1>Use the below link to reset your password</h1> <a href="http://localhost:3000/password-reset/${token}">Reset Password</a>`
    }
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = sendEmail