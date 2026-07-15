const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getDataFile() {
  return process.env.APPOINTMENTS_DATA_FILE || path.join(__dirname, '..', '..', 'data', 'appointments.json');
}

function readAll() {
  const file = getDataFile();
  if (!fs.existsSync(file)) {
    return [];
  }
  const raw = fs.readFileSync(file, 'utf-8');
  return raw.trim() ? JSON.parse(raw) : [];
}

function writeAll(appointments) {
  const file = getDataFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(appointments, null, 2));
}

function list() {
  return readAll();
}

function getById(id) {
  return readAll().find((a) => a.id === id);
}

function create({ patientId, date, notes }) {
  const appointments = readAll();
  const appointment = {
    id: crypto.randomUUID(),
    patientId,
    date,
    notes: notes || null,
    status: 'agendado',
    createdAt: new Date().toISOString(),
  };
  appointments.push(appointment);
  writeAll(appointments);
  return appointment;
}

function update(id, updates) {
  const appointments = readAll();
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) {
    return undefined;
  }
  appointments[index] = { ...appointments[index], ...updates, id };
  writeAll(appointments);
  return appointments[index];
}

function remove(id) {
  const appointments = readAll();
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) {
    return false;
  }
  appointments.splice(index, 1);
  writeAll(appointments);
  return true;
}

module.exports = { list, getById, create, update, remove };
