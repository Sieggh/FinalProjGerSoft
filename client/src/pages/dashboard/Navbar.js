import React, { useState } from 'react';
import userImg from '../../assets/default-avatar.jpg';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onLogout, onPerfil }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  const navigate = useNavigate();

  const handlePerfil = () => {
    setMostrarMenu(false);
    navigate('/dashboard/perfil');
  };

  const handleLogout = () => {
    setMostrarMenu(false);
    onLogout();
  };

  return (
    <div className="navbar">
      <div className="navbar-right">
        <div className="perfil-area">
          <img
            src={userImg}
            alt="Usuário"
            className="avatar"
            onClick={toggleMenu}
          />

          {mostrarMenu && (
            <div className="dropdown-menu">
              <div className="menu-header">
                <img src={userImg} className="avatar" alt="perfil" />
                <span>{usuario.nome || 'Administrador'}</span>
              </div>
              <div className="menu-item" onClick={handlePerfil}>Meu Perfil</div>
              <button className="sair-btn" onClick={handleLogout}>Sair</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
