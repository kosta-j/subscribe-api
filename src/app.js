const express = require('express');
const cors = require('cors');

const subscriberRoutes = require('./routes/subscriberRoutes');

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_CORS_ORIGIN,
    methods: ['GET', 'POST'],
}));
app.use(express.json());

app.use('/api/subscribers', subscriberRoutes);

module.exports = app;
