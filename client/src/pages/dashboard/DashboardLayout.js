import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Home from './Home';
import Funcionarios from './Funcionarios';
import Empresas from './Empresas';
import Setores from './Setores';
import Cargos from './Cargos';
import PerfilAdmin from './PerfilAdmin';
import '../../style/dashboard.css';
import '../../style/perfiladmin.css';
import '../../style/navbar.css';
import '../../style/sidebar.css';
import '../../style/cargo_setor.css';
import '../../style/card.css';

const DashboardLayout = ({ onLogout }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar onLogout={onLogout} />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/setores" element={<Setores />} />
            <Route path="/cargos" element={<Cargos />} />
            <Route path="/perfil" element={<PerfilAdmin />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
