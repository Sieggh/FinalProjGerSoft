import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [horaAtual, setHoraAtual] = useState(new Date());
  const [horariosDoDia, setHorariosDoDia] = useState([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    atualizarHora();
    const interval = setInterval(atualizarHora, 1000);
    carregarPontosDoDia();
    return () => clearInterval(interval);
  }, []);

  const atualizarHora = () => {
    setHoraAtual(new Date());
  };

  const carregarPontosDoDia = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/ponto/meus', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const hoje = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
      const pontoHoje = res.data.find(p => p.data?.startsWith(hoje));

      if (pontoHoje) {
        setHorariosDoDia(pontoHoje.horarios);
      } else {
        setHorariosDoDia([]);
      }
    } catch (err) {
      console.error(err);
      setHorariosDoDia([]);
    }
  };

  const registrarPonto = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:4000/api/ponto/registrar', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMensagem(res.data.msg);
      carregarPontosDoDia();
    } catch (err) {
      setMensagem(err.response?.data?.msg || 'Erro ao registrar ponto');
    }
  };

  const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarHora = (hora) => {
    return hora.length === 5 ? `${hora}:00` : hora;
  };

  const tipos = ['1ª Entrada', '1ª Saída', '2ª Entrada', '2ª Saída'];

  return (
    <div className="card">
      <header className="header">
        <h2>Dashboard</h2>
      </header>

      <div style={{ fontSize: '1.1rem', marginBottom: '5px' }}>
        {formatarData(horaAtual)} -{' '}
        <span style={{ fontSize: '1.5rem' }}>
          {horaAtual.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </span>
      </div>

      <button onClick={registrarPonto} className="botao-salvar">
        Bater Ponto
      </button>

      {mensagem && <p style={{ marginTop: '10px', color: '#555' }}>{mensagem}</p>}

      <h3 style={{ marginTop: '30px' }}>Pontos do Dia</h3>

      {horariosDoDia.length === 0 ? (
        <p>Nenhum ponto registrado hoje.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="tabela">
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {horariosDoDia.map((h, i) => {
                const tipo = tipos[i] || 'Ponto';
                return (
                  <tr key={i}>
                    <td>{formatarData(horaAtual)}</td>
                    <td>{formatarHora(h)}</td>
                    <td>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '5px',
                      color: '#fff',
                      backgroundColor: tipo === '1ª Entrada' || tipo === '2ª Entrada' ? '#28a745' : '#dc3545'
                    }}
                  > {tipo}
                  </span>
                </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Home;
