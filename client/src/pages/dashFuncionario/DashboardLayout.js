import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Home from './Home';
import FolhaPonto from './FolhaPonto';
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
            <Route path="/folhaponto" element={<FolhaPonto />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
