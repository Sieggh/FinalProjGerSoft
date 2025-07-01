import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';


const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="logo-title">
        <img src={logo} alt="Logomarca" className="logo-small" />
        <h1>PointLog</h1>
      </div>

      <nav className="menu">
        <Link to="/dashFuncionario" className={isActive('/dashFuncionario') ? 'active' : ''}>
          Início
        </Link>
        <Link to="/dashFuncionario/folhaponto" className={isActive('/dashFuncionario/folhaponto') ? 'active' : ''}>
          Folha de Ponto
        </Link>

      </nav>
    </div>
  );
};

export default Sidebar;
