const API_BASE = 'http://localhost:3000/api';

async function handleResponse(res) {
  if (res.status === 204) {
    return null;
  }
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Erro na requisição');
  }
  return body;
}

export function getPatients() {
  return fetch(`${API_BASE}/patients`).then(handleResponse);
}

export function createPatient(patient) {
  return fetch(`${API_BASE}/patients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patient),
  }).then(handleResponse);
}

export function getAppointments() {
  return fetch(`${API_BASE}/appointments`).then(handleResponse);
}

export function createAppointment(appointment) {
  return fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  }).then(handleResponse);
}
