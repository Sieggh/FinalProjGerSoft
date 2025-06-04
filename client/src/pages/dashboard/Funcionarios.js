import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const funcionariosPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/usuarios/listar', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFuncionarios(res.data);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
    }
  };

  const totalPaginas = Math.ceil(funcionarios.length / funcionariosPorPagina);
  const funcionariosPaginados = funcionarios.slice(
    (paginaAtual - 1) * funcionariosPorPagina,
    paginaAtual * funcionariosPorPagina
  );

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Funcionários Cadastrados</h3>
        <button className="btn-adicionar" onClick={() => navigate('/dashboard/funcionarios/novo')}>+ Adicionar</button>
        </div>

        <div className="card-controls">
          <input type="text" placeholder="Buscar funcionário" className="input-busca" />
        </div>

      <table className="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Cargo</th>
            <th>Setor</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {funcionariosPaginados.map((usuario, index) => (
            <tr key={index}>
              <td>{usuario.nomeCompleto}</td>
              <td>{usuario.matricula}</td>
              <td>{usuario.cargo || '-'}</td>
              <td>{usuario.setor || '-'}</td>
              <td className="acoes">
                <FaEdit className="acao editar" />
              </td>
              <td className="acoes">
                <FaTrash className="acao excluir" />
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

export default Funcionarios;
