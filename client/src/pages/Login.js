import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    // Decide se é email ou matrícula
    const isEmail = identificador.includes('@');

    try {
      const response = await axios.post('http://localhost:4000/api/usuarios/login', {
        [isEmail ? 'email' : 'matricula']: identificador,
        senha
      });

      const { token, usuario } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      if (onLogin) {
      onLogin(usuario);

      // Redireciona manualmente baseado no tipo
      if (usuario.tipo === 'administrador') {
        window.location.href = '/dashboard';
      } else if (usuario.tipo === 'funcionario') {
        window.location.href = '/dashfuncionario';
      }
    }
    } catch (err) {
      setErro(err.response?.data?.msg || 'Erro ao fazer login.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email (admin) ou Matrícula (funcionário):</label><br />
          <input
            type="text"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label><br />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </div>
  );
};

export default Login;
