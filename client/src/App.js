import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './pages/dashboard/DashboardLayout';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('usuario');
    if (user) setUsuario(JSON.parse(user));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!usuario ? <Login onLogin={setUsuario} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard/*" element={usuario?.tipo === 'administrador' ? <DashboardLayout onLogout={() => {
          localStorage.clear();
          setUsuario(null);
        }} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
