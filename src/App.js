import React, { useState } from 'react';
import CameraComFiltro from './components/CameraComFiltro';
import CameraComFiltroFerro from './components/CameraComFiltroFerro';

function App() {
  const [componenteAtivo, setComponenteAtivo] = useState('filtro1');

  const botaoEstilo = (ativo) => ({
    padding: '12px 24px',
    margin: '0 10px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    backgroundColor: ativo ? '#444' : '#ccc',
    color: ativo ? 'white' : '#222',
    transition: 'all 0.3s ease',
    boxShadow: ativo ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
  });

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'black', minHeight: '100vh', color: '#fff' }}>
      <div style={{ marginBottom: '30px' }}>
        <button
          style={botaoEstilo(componenteAtivo === 'filtro1')}
          onClick={() => setComponenteAtivo('filtro1')}
        >
          Daguerreótipo
        </button>
        <button
          style={botaoEstilo(componenteAtivo === 'filtro2')}
          onClick={() => setComponenteAtivo('filtro2')}
        >
          Ferrótipo
        </button>
      </div>

      {componenteAtivo === 'filtro1' && <CameraComFiltro />}
      {componenteAtivo === 'filtro2' && <CameraComFiltroFerro />}
    </div>
  );
}

export default App;