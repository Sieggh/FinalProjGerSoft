import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Setores = () => {
  const [setores, setSetores] = useState([]);
  const [empresa, setEmpresa] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtro, setFiltro] = useState('');
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

    const setoresFiltrados = setores.filter((item) =>
    item.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    const totalPaginas = Math.ceil(setoresFiltrados.length / setoresPorPagina);
    const setoresPaginados = setoresFiltrados.slice(
      (paginaAtual - 1) * setoresPorPagina,
      paginaAtual * setoresPorPagina
    );

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

    const handleExcluir = async (id) => {
    const confirmacao = window.confirm("Tem certeza que deseja excluir?");
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/setores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Setor excluído com sucesso!");
      carregarSetores(); // Atualiza a lista
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.msg || "Erro ao excluir setor.";
      alert(msg);
    }
  };

  return (
      <div className="card">
        <div className="card-header">
          <h3>Setores da {empresa}</h3>
          
        </div>
        <button className="btn-adicionar" onClick={() => navigate('/dashboard/CadastroSetor')}>Adicionar</button>
        <div className="card-controls">
          <input 
            type="text" 
            placeholder="Buscar setor" 
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
              <th>Número de Funcionários</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {setoresPaginados.map((setor, index) => (
              <tr key={index}>
                <td>{setor.nome}</td>
                <td>{setor.quantidadeFuncionarios || 0}</td>
                <td className="acoes">
                  <FaEdit className="acao editar" onClick={() => navigate(`/dashboard/EditarSetor/${setor.id}`)} />
                </td>
                <td className='acoes'>
                  <FaTrash className="acao excluir" onClick={() => handleExcluir(setor.id)} />
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
