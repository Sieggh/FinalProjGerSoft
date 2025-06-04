import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const CadastrarSetor = () => {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario')) || {};
      setFormData({
        nome: '',
        empresa: usuarioLocal.empresa || ''
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/api/setores', {
        nome: formData.nome,
        nomeEmpresa: formData.empresa
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Setor cadastrado com sucesso!');
      navigate('/dashboard/setores');
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar setor');
    }
  };

  const handleCancelar = () => {
    setFormData({ nome: '', empresa: formData.empresa });
  };

  return (
    <div className="card">
      <div className="header"> 
        <FaArrowLeft
          style={{ cursor: 'pointer', marginRight: '10px' }}
          onClick={() => navigate('/dashboard/setores')}
        />
        <h3 style={{ display: 'inline' }}>Cadastro de Setor</h3>
      </div>

      <div className="perfil-content">
        <div className="perfil-form">
        <div className="coluna">
        <label>Nome do Setor</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
        />
        </div>

        <div className="coluna">
        <label>Empresa</label>
        <input
          type="text"
          name="empresa"
          value={formData.empresa}
          disabled
        />
        </div>
        </div>
      </div>

      <div className="perfil-actions">
        <button className="botao-salvar" onClick={handleSalvar} disabled={!formData.nome}>
          Salvar
        </button>
        <button className="botao-cancelar" onClick={handleCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CadastrarSetor;
