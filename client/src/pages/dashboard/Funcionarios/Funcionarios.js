import React, { useEffect, useState } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtro, setFiltro] = useState('');
  const funcionariosPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFuncionarios(res.data);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
    }
  };

    const funcionariosFiltrados = funcionarios.filter((item) =>
    item.nomeCompleto.toLowerCase().includes(filtro.toLowerCase())
    );

    const totalPaginas = Math.ceil(funcionariosFiltrados.length / funcionariosPorPagina);
    const funcionariosPaginados = funcionariosFiltrados.slice(
      (paginaAtual - 1) * funcionariosPorPagina,
      paginaAtual * funcionariosPorPagina
    );

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/usuarios/funcionario/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Funcionário excluído com sucesso!');
      carregarFuncionarios(); // atualiza a lista
    } catch (err) {
      console.error('Erro ao excluir funcionário:', err);
      alert('Erro ao excluir funcionário. Verifique se ele ainda está vinculado a algum registro.');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Funcionários Cadastrados</h3>
        <button className="btn-adicionar" onClick={() => navigate('/dashboard/CadastroFuncionario')}>+ Adicionar</button>
        </div>

        <div className="card-controls">
          <input
            type="text"
            placeholder="Buscar funcionários"
            className="input-busca"
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPaginaAtual(1); // reseta para primeira página ao buscar
            }}
          />
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
              <td>{usuario.cargo}</td>
              <td>{usuario.setor}</td>
              <td className="acoes">
                <FaEye className="acao editar" onClick={() => navigate(`/dashboard/EditarFuncionario/${usuario.id}`)}/>
              </td>
              <td className="acoes">
                <FaTrash className="acao excluir" onClick={() => handleExcluir(usuario.id)} />
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
