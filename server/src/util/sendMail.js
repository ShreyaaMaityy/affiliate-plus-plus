const nodemailer = require('nodemailer');

const sendMail = async (options) => {
    // 1. Create a transporter specifically for Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail', // This automatically sets the host and port for Gmail
        auth: {
            user: process.env.GMAIL_EMAIL_ID,      // Uses your variable from .env
            pass: process.env.GMAIL_APP_PASSWORD   // Uses your variable from .env
        }
    });

    // 2. Define the email options
    const mailOptions = {
        from: `"Affiliate++" <${process.env.GMAIL_EMAIL_ID}>`, // Set the "from" address
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;