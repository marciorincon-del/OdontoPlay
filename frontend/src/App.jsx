import { useState } from 'react';
import PatientsSection from './components/PatientsSection';
import AppointmentsSection from './components/AppointmentsSection';

export default function App() {
  const [tab, setTab] = useState('patients');

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>OdontoPlay</h1>
      <nav>
        <button onClick={() => setTab('patients')} disabled={tab === 'patients'}>
          Pacientes
        </button>
        <button onClick={() => setTab('appointments')} disabled={tab === 'appointments'}>
          Agendamentos
        </button>
      </nav>
      {tab === 'patients' ? <PatientsSection /> : <AppointmentsSection />}
    </main>
  );
}
