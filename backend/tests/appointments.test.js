const fs = require('fs');
const path = require('path');
const os = require('os');

let app;
let patientsFile;
let appointmentsFile;

beforeEach(() => {
  const suffix = `${Date.now()}-${Math.random()}`;
  patientsFile = path.join(os.tmpdir(), `odontoplay-patients-${suffix}.json`);
  appointmentsFile = path.join(os.tmpdir(), `odontoplay-appointments-${suffix}.json`);
  fs.writeFileSync(patientsFile, '[]');
  fs.writeFileSync(appointmentsFile, '[]');
  process.env.DATA_FILE = patientsFile;
  process.env.APPOINTMENTS_DATA_FILE = appointmentsFile;
  jest.resetModules();
  app = require('../src/app');
});

afterEach(() => {
  fs.rmSync(patientsFile, { force: true });
  fs.rmSync(appointmentsFile, { force: true });
  delete process.env.DATA_FILE;
  delete process.env.APPOINTMENTS_DATA_FILE;
});

const request = require('supertest');

async function createPatient(name = 'Maria Silva') {
  const res = await request(app).post('/api/patients').send({ name });
  return res.body;
}

describe('API de Agendamentos', () => {
  test('lista agendamentos vazia inicialmente', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('cria um agendamento para um paciente existente', async () => {
    const patient = await createPatient();
    const res = await request(app)
      .post('/api/appointments')
      .send({ patientId: patient.id, date: '2026-07-20T14:30:00.000Z', notes: 'Limpeza' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      patientId: patient.id,
      date: '2026-07-20T14:30:00.000Z',
      notes: 'Limpeza',
      status: 'agendado',
    });
    expect(res.body.id).toBeDefined();
  });

  test('rejeita criação sem patientId ou date', async () => {
    const res = await request(app).post('/api/appointments').send({ notes: 'Sem paciente' });
    expect(res.status).toBe(400);
  });

  test('rejeita criação com patientId inexistente', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ patientId: 'id-que-nao-existe', date: '2026-07-20T14:30:00.000Z' });
    expect(res.status).toBe(404);
  });

  test('busca agendamento por id', async () => {
    const patient = await createPatient();
    const created = await request(app)
      .post('/api/appointments')
      .send({ patientId: patient.id, date: '2026-07-20T14:30:00.000Z' });
    const res = await request(app).get(`/api/appointments/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.patientId).toBe(patient.id);
  });

  test('retorna 404 ao buscar id inexistente', async () => {
    const res = await request(app).get('/api/appointments/id-que-nao-existe');
    expect(res.status).toBe(404);
  });

  test('atualiza um agendamento', async () => {
    const patient = await createPatient();
    const created = await request(app)
      .post('/api/appointments')
      .send({ patientId: patient.id, date: '2026-07-20T14:30:00.000Z' });
    const res = await request(app)
      .put(`/api/appointments/${created.body.id}`)
      .send({ status: 'concluído' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('concluído');
  });

  test('remove um agendamento', async () => {
    const patient = await createPatient();
    const created = await request(app)
      .post('/api/appointments')
      .send({ patientId: patient.id, date: '2026-07-20T14:30:00.000Z' });
    const del = await request(app).delete(`/api/appointments/${created.body.id}`);
    expect(del.status).toBe(204);

    const getAfter = await request(app).get(`/api/appointments/${created.body.id}`);
    expect(getAfter.status).toBe(404);
  });
});
