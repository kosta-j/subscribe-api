const Subscriber = require('../models/Subscriber');

exports.subscribe = async (req, res) => {
  const { email } = req.body;
  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json({ message: 'Successfully subscribed' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'Email is already subscribed' });
    } else {
      res
        .status(500)
        .json({ error: 'Internal server error', code: error.code });
    }
  }
};
