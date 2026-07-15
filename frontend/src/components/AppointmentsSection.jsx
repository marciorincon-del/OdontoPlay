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
    <section className="card">
      <h2>Agendamentos</h2>
      {error && <p className="error-banner">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
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
        </div>
        <button className="btn" type="submit">
          Agendar
        </button>
      </form>
      {appointments.length === 0 ? (
        <p className="empty-state">Nenhum agendamento ainda.</p>
      ) : (
        <ul className="list">
          {appointments.map((a) => (
            <li key={a.id}>
              <span className="primary">{patientName(a.patientId)}</span>
              <span className="secondary">
                {new Date(a.date).toLocaleString('pt-BR')}
                {a.notes ? ` · ${a.notes}` : ''}
              </span>
              <span className="status-badge">{a.status}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
