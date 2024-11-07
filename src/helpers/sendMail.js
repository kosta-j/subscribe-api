const nodemailer = require('nodemailer');
const { EMAIL_USER, EMAIL_PASS } = process.env;

const nodemailerConfig = {
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendMail = async (data) => {
  const email = { ...data, from: EMAIL_USER };
  const errorHandler = (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  };
  await transporter.sendMail(email, errorHandler);
  return true;
};

module.exports = sendMail;
