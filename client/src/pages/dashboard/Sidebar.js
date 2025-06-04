import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


const Sidebar = () => {
  const [cadastrosAberto, setCadastrosAberto] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="logo">
        Meu Ponto
      </div>

      <nav className="menu">
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          Início
        </Link>

        <div className="menu-section" onClick={() => setCadastrosAberto(!cadastrosAberto)}>
          <span>Cadastros</span> {cadastrosAberto ? '▾' : '▸'}
        </div>

        {cadastrosAberto && (
          <div className="submenu">
            <Link to="/dashboard/funcionarios" className={isActive('/dashboard/funcionarios') ? 'active' : ''}>
              Funcionários
            </Link>
            <Link to="/dashboard/setores" className={isActive('/dashboard/setores') ? 'active' : ''}>
              Setores
            </Link>
            <Link to="/dashboard/cargos" className={isActive('/dashboard/cargos') ? 'active' : ''}>
              Cargos
            </Link>
          </div>
        )}
        <Link to="/dashboard/empresas" className={isActive('/dashboard/empresas') ? 'active' : ''}>
          Empresas
        </Link>
        <Link to="/dashboard/administradores" className={isActive('/dashboard/administradores') ? 'active' : ''}>
          Administradores
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
