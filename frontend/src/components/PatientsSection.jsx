import { useEffect, useState } from 'react';
import { getPatients, createPatient } from '../api';

export default function PatientsSection() {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  function loadPatients() {
    getPatients().then(setPatients).catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadPatients();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await createPatient({ name, phone, email });
      setName('');
      setPhone('');
      setEmail('');
      loadPatients();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="card">
      <h2>Pacientes</h2>
      {error && <p className="error-banner">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="btn" type="submit">
          Adicionar paciente
        </button>
      </form>
      {patients.length === 0 ? (
        <p className="empty-state">Nenhum paciente cadastrado ainda.</p>
      ) : (
        <ul className="list">
          {patients.map((p) => (
            <li key={p.id}>
              <span className="primary">{p.name}</span>
              {(p.phone || p.email) && (
                <span className="secondary">
                  {[p.phone, p.email].filter(Boolean).join(' · ')}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
