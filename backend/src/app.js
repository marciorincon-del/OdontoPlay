const express = require('express');
const patientsRouter = require('./routes/patients');
const appointmentsRouter = require('./routes/appointments');

const app = express();

app.use(express.json());
app.use('/api/patients', patientsRouter);
app.use('/api/appointments', appointmentsRouter);

module.exports = app;
