import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';

const FolhaDePonto = () => {
  const [relatorio, setRelatorio] = useState([]);
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const navigate = useNavigate();
  const [mesSelecionado, setMesSelecionado] = useState(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${(hoje.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const { id } = useParams(); // id do funcionário vindo da URL

  useEffect(() => {
    const carregarFolha = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:4000/api/ponto/usuario/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { funcionario, folha } = res.data;
        setNomeFuncionario(`${funcionario.nome}`);

        const filtrados = folha
          .filter(d => d.data?.startsWith(mesSelecionado))
          .sort((a, b) => new Date(a.data) - new Date(b.data));

        let acumuladoMin = 0;

        const formatado = filtrados.map(d => {
          const minutosTrabalhados = calcularMinutosTrabalhados(d.horarios);
          const saldoMin = minutosTrabalhados - 480;
          acumuladoMin += saldoMin;

          return {
            data: formatarData(d.data),
            horarios: d.horarios,
            saldoDoDia: formatarMinutos(saldoMin),
            saldoAcumulado: formatarMinutos(acumuladoMin)
          };
        });

        setRelatorio(formatado);
      } catch (err) {
        console.error(err);
      }
    };

    carregarFolha();
  }, [mesSelecionado, id]);

  const calcularMinutosTrabalhados = (horarios) => {
    let total = 0;
    for (let i = 0; i < horarios.length; i += 2) {
      const entrada = new Date(`2020-01-01T${horarios[i]}`);
      const saida = horarios[i + 1] ? new Date(`2020-01-01T${horarios[i + 1]}`) : null;
      if (entrada && saida) {
        total += (saida - entrada) / 60000;
      }
    }
    return total;
  };

  const formatarMinutos = (min) => {
    const sinal = min >= 0 ? '+' : '-';
    const horas = Math.floor(Math.abs(min) / 60);
    const minutos = Math.abs(min) % 60;
    return `${sinal}${horas}h ${minutos.toString().padStart(2, '0')}min`;
  };

  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <div className="card">
      <div className='header'>
        <FaArrowLeft
          style={{ cursor: 'pointer', marginRight: '10px' }}
          onClick={() => navigate(`/dashboard/EditarFuncionario/${id}`)}
        />
        <h3>Folha de Ponto - {nomeFuncionario}</h3>
      </div>
      <div style={{ overflowX: 'auto'}}>
        <div style={{marginBottom: '20px'}}>
        <label>Filtrar por mês: </label>
        <input
          type="month"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
        />
        </div>
        <table className="tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Horários</th>
              <th>Saldo do Dia</th>
              <th>Saldo Acumulado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {relatorio.map((linha, index) => (
              <tr key={index}>
                <td>{linha.data}</td>
                <td>{linha.horarios.join(', ')}</td>
                <td>{linha.saldoDoDia}</td>
                <td>{linha.saldoAcumulado}</td>
                <td>
                  <FaEdit
                    className="acao editar"
                    onClick={() => navigate(`/dashboard/EditarPonto/${id}/${relatorio[index].data.split('/').reverse().join('-')}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FolhaDePonto;
