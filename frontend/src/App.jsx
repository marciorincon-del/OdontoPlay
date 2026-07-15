import { useState } from 'react';
import PatientsSection from './components/PatientsSection';
import AppointmentsSection from './components/AppointmentsSection';

export default function App() {
  const [tab, setTab] = useState('patients');

  return (
    <main className="app">
      <header className="app-header">
        <span className="logo">🦷</span>
        <h1>OdontoPlay</h1>
      </header>
      <nav className="tabs">
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
