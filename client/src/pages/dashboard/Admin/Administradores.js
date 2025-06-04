import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Administradores = () => {
  const [admins, setAdmins] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const adminsPorPagina = 10;
  const navigate = useNavigate();

  useEffect(() => {
    carregarAdmins();
  }, []);

  const carregarAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/usuarios/administradores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(res.data);
    } catch (err) {
      console.error('Erro ao carregar administradores:', err);
    }
  };

  const totalPaginas = Math.ceil(admins.length / adminsPorPagina);
  const adminsPaginados = admins.slice(
    (paginaAtual - 1) * adminsPorPagina,
    paginaAtual * adminsPorPagina
  );

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Administradores Cadastrados</h3>
        <button className="btn-adicionar" onClick={() => navigate('/dashboard/CadastroAdmin')}>
          + Adicionar
        </button>
      </div>

      <div className="card-controls">
        <input type="text" placeholder="Buscar administrador" className="input-busca" />
      </div>

      <table className="tabela">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {adminsPaginados.map((admin, index) => (
            <tr key={index}>
              <td>{admin.nomeCompleto}</td>
              <td>{admin.email}</td>
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

export default Administradores;
