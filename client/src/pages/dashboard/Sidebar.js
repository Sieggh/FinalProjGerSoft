import { Link, useLocation } from 'react-router-dom';


const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="logo">
        PointLog
      </div>

      <nav className="menu">
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          Início
        </Link>
        <Link to="/dashboard/funcionarios" className={isActive('/dashboard/funcionarios') ? 'active' : ''}>
          Funcionários
        </Link>
        <Link to="/dashboard/setores" className={isActive('/dashboard/setores') ? 'active' : ''}>
          Setores
        </Link>
        <Link to="/dashboard/cargos" className={isActive('/dashboard/cargos') ? 'active' : ''}>
          Cargos
        </Link>
        <Link to="/dashboard/empresas" className={isActive('/dashboard/empresas') ? 'active' : ''}>
          Empresa
        </Link>
        <Link to="/dashboard/administradores" className={isActive('/dashboard/administradores') ? 'active' : ''}>
          Administradores
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
