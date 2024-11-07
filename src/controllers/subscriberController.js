const sendMail = require('../helpers/sendMail');
const Subscriber = require('../models/Subscriber');
const { APP_URL, PORT, RECAPTCHA_SECRET } = process.env;

exports.subscribe = async (req, res) => {
  const { email, recaptchaToken } = req.body;
  try {
    // recaptcha check:
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET,
          response: recaptchaToken,
        }),
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return res
        .status(400)
        .json({ error: 'reCAPTCHA verification failed. Please try again.' });
    }

    // subscription:
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    const unsubscribeLink = `${APP_URL}:${PORT}/api/subscribers/unsubscribe?token=${newSubscriber.unsubscribeToken}`;
    const emailObj = {
      to: email,
      subject: 'Subscription Confirmation',
      text: `Thank you for subscribing! If you wish to unsubscribe, click here: ${unsubscribeLink}`,
    };
    await sendMail(emailObj);

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
