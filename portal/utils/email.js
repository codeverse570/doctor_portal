const nodemailer = require('nodemailer')
const pug = require("pug")
const htmlConverter = require("html-to-text")
module.exports = class Email {
  constructor(user, url) {
    this.email = user.email
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.sender = process.env.EMAIL_USER
  }
  createTransporter = () => {
    if (process.env.NODE_ENV == 'development') {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_USER_PASSWORD
        }
      })
    }
    else {
      return nodemailer.createTransport({
        host: process.env.BERVO_EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.BERVO_EMAIL_USER,
          pass: process.env.BERVO_EMAIL_USER_PASSWORD
        }
      })
    }
  }
  send = async (template, subject) => {
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      name: this.firstName,
      url: this.url,
      subject
    })
    const options = {
      from: process.env.BERVO_EMAIL_USER,
      to: this.email,
      subject,
      html,
      text: htmlConverter.convert(html),
    }
    await this.createTransporter().sendMail(options);
  }
  sendWelcomeEmail = async () => {
    await this.send("welcome", "welcome to our tours family!")
  }
  sendResetPassword = async () => {
    await this.send("passwordreset", "Reset password (valid for 10 min)")
  }
}
