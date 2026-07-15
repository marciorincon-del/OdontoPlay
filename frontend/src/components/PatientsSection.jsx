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
    <section>
      <h2>Pacientes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Adicionar paciente</button>
      </form>
      <ul>
        {patients.map((p) => (
          <li key={p.id}>
            {p.name} {p.phone ? `— ${p.phone}` : ''}
          </li>
        ))}
      </ul>
    </section>
  );
}
