import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomeAdmin = () => {
  const [ultimosPontos, setUltimosPontos] = useState([]);
  const [funcionariosAtivos, setFuncionariosAtivos] = useState(0);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:4000/api/ponto/ultimos', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUltimosPontos(res.data.ultimos); // array de { nome, horario }
        setFuncionariosAtivos(res.data.ativos); // número de funcionários ativos
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      }
    };

    carregarDados();
  }, []);

    const formatarHora = (iso) => {
    return new Date(iso).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

 return (
    <div className="card">
      <header className="header">
        <h3>Dashboard</h3>
      </header>

      <p><strong>Funcionários Ativos:</strong> {funcionariosAtivos}</p>

      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table className="tabela">
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Horário</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {ultimosPontos.map((item, index) => (
              <tr key={index}>
                <td>{item.nome}</td>
                <td>{formatarHora(item.horario)}</td>
                <td>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '5px',
                      color: '#fff',
                      backgroundColor: item.tipo === '1ª Entrada' || item.tipo === '2ª Entrada' ? '#28a745' : '#dc3545'
                    }}
                  >
                    {item.tipo}
                  </span>
                </td>
              </tr>
            ))}
            {ultimosPontos.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Nenhum ponto registrado hoje.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeAdmin;
