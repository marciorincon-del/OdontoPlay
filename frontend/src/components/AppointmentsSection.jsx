import { useEffect, useState } from 'react';
import { getAppointments, createAppointment, getPatients } from '../api';

export default function AppointmentsSection() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  function loadAppointments() {
    getAppointments().then(setAppointments).catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadAppointments();
    getPatients().then(setPatients).catch((err) => setError(err.message));
  }, []);

  function patientName(patientId) {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : 'Paciente desconhecido';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await createAppointment({ patientId, date: new Date(date).toISOString(), notes });
      setPatientId('');
      setDate('');
      setNotes('');
      loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <h2>Agendamentos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <select value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
          <option value="">Selecione um paciente</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Observações"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="submit">Agendar</button>
      </form>
      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            {new Date(a.date).toLocaleString('pt-BR')} — {patientName(a.patientId)} ({a.status})
          </li>
        ))}
      </ul>
    </section>
  );
}
