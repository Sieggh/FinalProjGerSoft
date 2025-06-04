import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Home from './Home';
import Funcionarios from './Funcionarios';
import Empresas from './Empresas';
import Setores from './Setor/Setores';
import Cargos from './Cargos';
import PerfilAdmin from './Admin/PerfilAdmin';
import Administradores from './Admin/Administradores'
import CadastroAdmin from './Admin/CadastroAdmin'
import CadastroSetor from './Setor/CadastroSetor'
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
            <Route path="/administradores" element={<Administradores />} />
            <Route path="/cadastroadmin" element={<CadastroAdmin />} />
            <Route path="/cadastrosetor" element={<CadastroSetor />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
