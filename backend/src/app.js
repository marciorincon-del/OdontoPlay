const express = require('express');
const patientsRouter = require('./routes/patients');

const app = express();

app.use(express.json());
app.use('/api/patients', patientsRouter);

module.exports = app;
