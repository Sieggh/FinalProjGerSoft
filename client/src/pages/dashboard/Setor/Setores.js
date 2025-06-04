import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Setores = () => {
  const [setores, setSetores] = useState([]);
  const [empresa, setEmpresa] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const setoresPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.empresa) {
      setEmpresa(usuario.empresa);
      carregarSetores();
    }
  }, []);

  const carregarSetores = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/setores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSetores(res.data);
    } catch (err) {
      console.error('Erro ao buscar setores', err);
    }
  };

  const totalPaginas = Math.ceil(setores.length / setoresPorPagina);
  const setoresPaginados = setores.slice(
    (paginaAtual - 1) * setoresPorPagina,
    paginaAtual * setoresPorPagina
  );

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
      <div className="card">
        <div className="card-header">
          <h3>Setores da {empresa}</h3>
          <button className="btn-adicionar" onClick={() => navigate('/dashboard/CadastroSetor')}>+ Adicionar</button>
        </div>

        <div className="card-controls">
          <input type="text" placeholder="Buscar setor" className="input-busca" />
        </div>

        <table className="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Número de Funcionários</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {setoresPaginados.map((setor, index) => (
              <tr key={index}>
                <td>{setor.nome}</td>
                <td>{setor.totalFuncionarios || 0}</td>
                <td className="acoes">
                    <FaEdit className="acao editar" />
                </td>
                <td className='acoes'>
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

export default Setores;
