import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cargos = () => {
  const [cargos, setCargos] = useState([]);
  const [empresa, setEmpresa] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtro, setFiltro] = useState('');
  const cargosPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.empresa) {
      setEmpresa(usuario.empresa);
      carregarCargos();
    }
  }, []);

  const carregarCargos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/cargos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCargos(res.data);
    } catch (err) {
      console.error('Erro ao buscar cargos', err);
    }
  };

    const cargosFiltrados = cargos.filter((item) =>
    item.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    const totalPaginas = Math.ceil(cargosFiltrados.length / cargosPorPagina);
    const cargosPaginados = cargosFiltrados.slice(
      (paginaAtual - 1) * cargosPorPagina,
      paginaAtual * cargosPorPagina
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
      await axios.delete(`http://localhost:4000/api/cargos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Cargo excluído com sucesso!");
      carregarCargos(); // Atualiza a lista
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.msg || "Erro ao excluir cargo.";
      alert(msg);
    }
  };

  return (
      <div className="card">
        <div className="card-header">
          <h3>Cargos da {empresa}</h3>
        </div>
        <button className="btn-adicionar" onClick={() => navigate('/dashboard/CadastroCargo')}>Adicionar</button>
        <div className="card-controls">
          <input
            type="text"
            placeholder="Buscar cargo"
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
            {cargosPaginados.map((cargo, index) => (
              <tr key={index}>
                <td>{cargo.nome}</td>
                <td>{cargo.quantidadeFuncionarios || 0}</td>
                <td className="acoes">
                    <FaEdit className="acao editar" onClick={() => navigate(`/dashboard/EditarCargo/${cargo.id}`)} />
                </td>
                <td className='acoes'>
                    <FaTrash className="acao excluir" onClick={() => handleExcluir(cargo.id)} />
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

export default Cargos;
