const express = require('express');
const patientsStore = require('../data/patientsStore');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(patientsStore.list());
});

router.get('/:id', (req, res) => {
  const patient = patientsStore.getById(req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Paciente não encontrado' });
  }
  res.json(patient);
});

router.post('/', (req, res) => {
  const { name, phone, email } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'O campo "name" é obrigatório' });
  }
  const patient = patientsStore.create({ name, phone, email });
  res.status(201).json(patient);
});

router.put('/:id', (req, res) => {
  const patient = patientsStore.update(req.params.id, req.body);
  if (!patient) {
    return res.status(404).json({ error: 'Paciente não encontrado' });
  }
  res.json(patient);
});

router.delete('/:id', (req, res) => {
  const removed = patientsStore.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Paciente não encontrado' });
  }
  res.status(204).send();
});

module.exports = router;
