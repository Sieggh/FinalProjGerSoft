import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PerfilAdmin = () => {
    
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });

    const [originalData, setOriginalData] = useState({});
    const [senhaIgual, setSenhaIgual] = useState(true);
    const [alterado, setAlterado] = useState(false);

    useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario')) || {};

    setFormData({
        nomeCompleto: usuarioLocal.nome || '',
        email: usuarioLocal.email || '',
        senha: '',
        confirmarSenha: ''
    });

    setOriginalData({
        nomeCompleto: usuarioLocal.nome || '',
        email: usuarioLocal.email || ''
    });
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const atualizado = {
      ...formData,
      [name]: value
    };

    setFormData(atualizado);

    // Verifica se houve alterações em nome ou email
    const houveAlteracao =
      atualizado.nomeCompleto !== originalData.nomeCompleto ||
      atualizado.email !== originalData.email ||
      atualizado.senha.length > 0;

    setAlterado(houveAlteracao);

    // Verifica se senhas coincidem
    if (name === 'senha' || name === 'confirmarSenha') {
      setSenhaIgual(atualizado.senha === atualizado.confirmarSenha);
    }
  };


    const handleSalvar = async () => {
        if (!senhaIgual) return;

        try {
            const token = localStorage.getItem('token');

            const payload = {
            nomeCompleto: formData.nomeCompleto,
            email: formData.email,
            };

            if (formData.senha) {
            payload.senha = formData.senha;
            }

            const response = await axios.put('http://localhost:4000/api/usuarios/admin', payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });

            // Atualiza localStorage e dados originais
            const usuarioAtualizado = response.data.usuario;
            localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));

            setOriginalData({
            nomeCompleto: usuarioAtualizado.nome,
            email: usuarioAtualizado.email
            });

            setAlterado(false);
            setFormData({ ...formData, senha: '', confirmarSenha: '' });

            alert('Perfil atualizado com sucesso.');
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar perfil.');
        }
    };

    const handleCancelar = () => {
        setFormData({
            nomeCompleto: originalData.nomeCompleto,
            email: originalData.email,
            senha: '',
            confirmarSenha: ''
        });
        setAlterado(false);
        setSenhaIgual(true);
    };

  return (
      <div className="card">
        <h2>Editar Perfil Administrador</h2>

        <div className="perfil-content">
          <div className="perfil-form">
            <div className="coluna">
              <label>Nome obrigatório</label>
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
              <label>E-mail</label>
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
              {!senhaIgual && <p style={{ color: 'red', fontSize: 12 }}>As senhas não coincidem.</p>}
            </div>
          </div>
        </div>

        <div className="perfil-actions">
          <button
            className="botao-salvar"
            onClick={handleSalvar}
            disabled={!alterado || !senhaIgual}
          >
            Salvar
          </button>
          <button className="botao-cancelar" onClick={handleCancelar}>
            Cancelar
        </button>
        </div>
      </div>
  );
};



export default PerfilAdmin;
