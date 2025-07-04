import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Home from './Home';
import Funcionarios from './Funcionarios/Funcionarios';
import Empresas from './Empresa/Empresas';
import Setores from './Setor/Setores';
import Cargos from './Cargos/Cargos';
import PerfilAdmin from './Admin/PerfilAdmin';
import Administradores from './Admin/Administradores';
import CadastroAdmin from './Admin/CadastroAdmin';
import CadastroSetor from './Setor/CadastroSetor';
import EditarSetor from './Setor/EditarSetor';
import EditarCargo from './Cargos/EditarCargo';
import CadastroCargo from './Cargos/CadastroCargo';
import EditarEmpresa from './Empresa/EditarEmpresa';
import EditarFuncionario from './Funcionarios/EditarFuncionario';
import CadastroFuncionario from './Funcionarios/CadastroFuncionario';
import FolhaPonto from './Funcionarios/FolhaPonto';
import EditarPonto from './Funcionarios/EditarPonto';
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
            <Route path="/editarsetor/:id" element={<EditarSetor />} />
            <Route path="/editarcargo/:id" element={<EditarCargo />} />
            <Route path="/editarempresa/:id" element={<EditarEmpresa />} />
            <Route path="/cadastrocargo" element={<CadastroCargo />} />
            <Route path="/editarfuncionario/:id" element={<EditarFuncionario />} />
            <Route path="/cadastrofuncionario" element={<CadastroFuncionario />} />
            <Route path="/folhaponto/:id" element={<FolhaPonto />} />
            <Route path="/editarponto/:id/:data" element={<EditarPonto />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
