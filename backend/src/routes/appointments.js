const express = require('express');
const appointmentsStore = require('../data/appointmentsStore');
const patientsStore = require('../data/patientsStore');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(appointmentsStore.list());
});

router.get('/:id', (req, res) => {
  const appointment = appointmentsStore.getById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ error: 'Agendamento não encontrado' });
  }
  res.json(appointment);
});

router.post('/', (req, res) => {
  const { patientId, date, notes } = req.body;
  if (!patientId || !date) {
    return res.status(400).json({ error: 'Os campos "patientId" e "date" são obrigatórios' });
  }
  if (!patientsStore.getById(patientId)) {
    return res.status(404).json({ error: 'Paciente não encontrado' });
  }
  const appointment = appointmentsStore.create({ patientId, date, notes });
  res.status(201).json(appointment);
});

router.put('/:id', (req, res) => {
  const appointment = appointmentsStore.update(req.params.id, req.body);
  if (!appointment) {
    return res.status(404).json({ error: 'Agendamento não encontrado' });
  }
  res.json(appointment);
});

router.delete('/:id', (req, res) => {
  const removed = appointmentsStore.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Agendamento não encontrado' });
  }
  res.status(204).send();
});

module.exports = router;
