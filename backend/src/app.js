const express = require('express');
const cors = require('cors');
const patientsRouter = require('./routes/patients');
const appointmentsRouter = require('./routes/appointments');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/patients', patientsRouter);
app.use('/api/appointments', appointmentsRouter);

module.exports = app;
