import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const empresasPorPagina = 10;

  useEffect(() => {
    buscarEmpresas();
  }, []);

  const buscarEmpresas = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/empresa', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpresas(res.data);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
  };

  const totalPaginas = Math.ceil(empresas.length / empresasPorPagina);
  const empresasPaginadas = empresas.slice(
    (paginaAtual - 1) * empresasPorPagina,
    paginaAtual * empresasPorPagina
  );

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
      <div className="card">
        <div className="card-header">
          <h3>Empresa Cadastrada</h3>
        </div>

        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Número de Funcionários</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {empresasPaginadas.map((empresa, index) => (
              <tr key={index}>
                <td>{empresa.nome}</td>
                <td>{empresa.totalFuncionarios || 0}</td>
                <td className="acoes">
                    <FaEdit className="acao editar" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="paginacao">
            <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>
            ‹
            </button>
            {[...Array(totalPaginas)].map((_, i) => (
            <button
                key={i}
                className={paginaAtual === i + 1 ? 'ativo' : ''}
                onClick={() => mudarPagina(i + 1)}
            >
                {i + 1}
            </button>
            ))}
            <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            >
            ›
            </button>
        </div>
      </div>
  );
};

export default Empresas;
