import React, { useState } from 'react';
import loginImage from '../assets/login.jpg';
import axios from 'axios';
import '../style/login.css';
import logo from '../assets/logo.png'; // Criamos esse CSS externo com o estilo do Vue

const Login = ({ onLogin }) => {
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [expand, setExpand] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    const isEmail = identificador.includes('@');

    try {
      const response = await axios.post('http://localhost:4000/api/usuarios/login', {
        [isEmail ? 'email' : 'matricula']: identificador,
        senha
      });

      const { token, usuario } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      if (onLogin) onLogin(usuario);

      if (usuario.tipo === 'administrador') {
        window.location.href = '/dashboard';
      } else if (usuario.tipo === 'funcionario') {
        window.location.href = '/dashfuncionario';
      }
    } catch (err) {
      setErro(err.response?.data?.msg || 'Erro ao fazer login.');
    }
  };

  const goToRegister = () => {
    setExpand(true);
    setTimeout(() => {
      window.location.href = '/register'; // Ou use navegação do React Router
    }, 500);
  };

  return (
    <div className={`wrapper ${expand ? 'expand' : ''}`}>
      <div className="backGround">
        <div className="container">
          <div className="logo-title">
            <img src={logo} alt="Logomarca" className="logo-small" />
            <h1 className='h1Login'>PointLog</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className='iptLogin'
              placeholder="Email ou Matrícula"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              required
            />
            <input
              type="password"
              className='iptLogin'
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button className='btnLogin' type="submit">Entrar</button>
          </form>
          {erro && <p style={{ color: 'red' }}>{erro}</p>}
        </div>
      </div>
      <div className="rightImage">
        <img src={loginImage} alt="Login visual" />
      </div>
    </div>
  );
};

export default Login;
