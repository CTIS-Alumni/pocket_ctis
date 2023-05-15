const mailConfig = {
    service: "hotmail",
    auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASS,
    },
}

module.exports = mailConfig