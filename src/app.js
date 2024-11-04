const express = require('express');
const subscriberRoutes = require('./routes/subscriberRoutes');

const app = express();
app.use(express.json());
app.use('/api/subscribers', subscriberRoutes);

module.exports = app;
