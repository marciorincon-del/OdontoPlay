const fs = require('fs');
const path = require('path');
const os = require('os');

let app;
let dataFile;

beforeEach(() => {
  dataFile = path.join(os.tmpdir(), `odontoplay-patients-${Date.now()}-${Math.random()}.json`);
  fs.writeFileSync(dataFile, '[]');
  process.env.DATA_FILE = dataFile;
  jest.resetModules();
  app = require('../src/app');
});

afterEach(() => {
  fs.rmSync(dataFile, { force: true });
  delete process.env.DATA_FILE;
});

const request = require('supertest');

describe('API de Pacientes', () => {
  test('lista pacientes vazia inicialmente', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('cria um paciente', async () => {
    const res = await request(app)
      .post('/api/patients')
      .send({ name: 'Maria Silva', phone: '11999999999' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Maria Silva', phone: '11999999999' });
    expect(res.body.id).toBeDefined();
  });

  test('rejeita criação sem nome', async () => {
    const res = await request(app).post('/api/patients').send({ phone: '11999999999' });
    expect(res.status).toBe(400);
  });

  test('busca paciente por id', async () => {
    const created = await request(app).post('/api/patients').send({ name: 'João Souza' });
    const res = await request(app).get(`/api/patients/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('João Souza');
  });

  test('retorna 404 ao buscar id inexistente', async () => {
    const res = await request(app).get('/api/patients/id-que-nao-existe');
    expect(res.status).toBe(404);
  });

  test('atualiza um paciente', async () => {
    const created = await request(app).post('/api/patients').send({ name: 'Ana Costa' });
    const res = await request(app)
      .put(`/api/patients/${created.body.id}`)
      .send({ phone: '11888888888' });
    expect(res.status).toBe(200);
    expect(res.body.phone).toBe('11888888888');
    expect(res.body.name).toBe('Ana Costa');
  });

  test('remove um paciente', async () => {
    const created = await request(app).post('/api/patients').send({ name: 'Pedro Lima' });
    const del = await request(app).delete(`/api/patients/${created.body.id}`);
    expect(del.status).toBe(204);

    const getAfter = await request(app).get(`/api/patients/${created.body.id}`);
    expect(getAfter.status).toBe(404);
  });
});
