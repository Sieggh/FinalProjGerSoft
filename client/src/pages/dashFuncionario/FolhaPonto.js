import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RelatorioFuncionario = () => {
  const [relatorio, setRelatorio] = useState([]);
  const [mesSelecionado, setMesSelecionado] = useState(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${(hoje.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  useEffect(() => {
    const carregarPontos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:4000/api/ponto/meus', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const dados = res.data;

        const filtrados = dados
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

    carregarPontos();
  }, [mesSelecionado]);

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
      <h2>Relatório de Pontos</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Filtrar por mês: </label>
        <input
          type="month"
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(e.target.value)}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="tabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Horários</th>
              <th>Saldo do Dia</th>
              <th>Saldo Acumulado</th>
            </tr>
          </thead>
          <tbody>
            {relatorio.map((linha, index) => (
              <tr key={index}>
                <td>{linha.data}</td>
                <td>{linha.horarios.join(', ')}</td>
                <td>{linha.saldoDoDia}</td>
                <td>{linha.saldoAcumulado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RelatorioFuncionario;
