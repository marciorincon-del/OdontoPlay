const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getDataFile() {
  return process.env.DATA_FILE || path.join(__dirname, '..', '..', 'data', 'patients.json');
}

function readAll() {
  const file = getDataFile();
  if (!fs.existsSync(file)) {
    return [];
  }
  const raw = fs.readFileSync(file, 'utf-8');
  return raw.trim() ? JSON.parse(raw) : [];
}

function writeAll(patients) {
  const file = getDataFile();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(patients, null, 2));
}

function list() {
  return readAll();
}

function getById(id) {
  return readAll().find((p) => p.id === id);
}

function create({ name, phone, email }) {
  const patients = readAll();
  const patient = {
    id: crypto.randomUUID(),
    name,
    phone: phone || null,
    email: email || null,
    createdAt: new Date().toISOString(),
  };
  patients.push(patient);
  writeAll(patients);
  return patient;
}

function update(id, updates) {
  const patients = readAll();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) {
    return undefined;
  }
  patients[index] = { ...patients[index], ...updates, id };
  writeAll(patients);
  return patients[index];
}

function remove(id) {
  const patients = readAll();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) {
    return false;
  }
  patients.splice(index, 1);
  writeAll(patients);
  return true;
}

module.exports = { list, getById, create, update, remove };
