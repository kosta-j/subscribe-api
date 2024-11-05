const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');
const { APP_URL, PORT, EMAIL_USER, EMAIL_PASS } = process.env;

exports.subscribe = async (req, res) => {
  const { email } = req.body;
  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    const unsubscribeLink = `${APP_URL}:${PORT}/api/subscribers/unsubscribe?token=${newSubscriber.unsubscribeToken}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Send email with unsubscribe link
    await transporter.sendMail(
      {
        from: EMAIL_USER,
        to: email,
        subject: 'Subscription Confirmation',
        text: `Thank you for subscribing! If you wish to unsubscribe, click here: ${unsubscribeLink}`,
      },
      (error, info) => {
        if (error) {
          console.error('Error sending email: ', error);
        } else {
          console.log('Email sent: ', info.response);
        }
      }
    );

    res.status(201).json({ message: 'Successfully subscribed' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'Email is already subscribed' });
    } else {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
};

exports.unsubscribe = async (req, res) => {
  const { token } = req.query;
  try {
    const subscriber = await Subscriber.findOneAndDelete({
      unsubscribeToken: token,
    });

    if (!subscriber) {
      return res.status(404).json({ error: 'Invalid unsubscribe token' });
    }

    res.status(200).json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
