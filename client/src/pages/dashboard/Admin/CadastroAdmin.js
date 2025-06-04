import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const CadastroAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    empresa: '',
  });

  const [senhaIgual, setSenhaIgual] = useState(true);

  useEffect(() => {
  const usuarioLocal = JSON.parse(localStorage.getItem('usuario')) || {};

  setFormData({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    empresa: usuarioLocal.empresa || ''
  });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'senha' || name === 'confirmarSenha') {
      setSenhaIgual(
        name === 'senha'
          ? value === formData.confirmarSenha
          : formData.senha === value
      );
    }
  };

  const handleSalvar = async () => {
    if (!senhaIgual) return;

    try {
      const token = localStorage.getItem('token');
      const payload = {
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        senha: formData.senha,
        nomeEmpresa: formData.empresa,
      };

      await axios.post('http://localhost:4000/api/usuarios/admin', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Administrador cadastrado com sucesso!');
      navigate('/dashboard/administradores');
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar administrador.');
    }
  };

  const handleCancelar = () => {
    setFormData((prev) => ({
      nomeCompleto: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      empresa: prev.empresa,
    }));
    setSenhaIgual(true);
  };

  return (
    <div className="card">
      <div className='header'>
        <FaArrowLeft
          style={{ cursor: 'pointer', marginRight: '10px' }}
          onClick={() => navigate('/dashboard/administradores')}
        />
        <h3>Cadastro de Administrador</h3>
      </div>

      <div className="perfil-content">
        <div className="perfil-form">
          <div className="coluna">
            <label>Nome</label>
            <input
              type="text"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
            />

            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
            />
          </div>

          <div className="coluna">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <label>Confirmar Senha</label>
            <input
              type="password"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
            />
            {!senhaIgual && (
              <p style={{ color: 'red', fontSize: 12 }}>As senhas não coincidem.</p>
            )}
          </div>
        </div>
      </div>
      
        <div className="coluna full-width">
        <label>Empresa</label>
        <input
            type="text"
            name="empresa"
            value={formData.empresa}
            disabled
        />
        </div>

      <div className="perfil-actions">
        <button className="botao-salvar" onClick={handleSalvar} disabled={!senhaIgual}>
          Salvar
        </button>
        <button className="botao-cancelar" onClick={handleCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CadastroAdmin;
