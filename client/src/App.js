import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashFuncionario from './pages/dashFuncionario/DashboardLayout'; // <- importe aqui

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('usuario');
    if (user) setUsuario(JSON.parse(user));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!usuario ? <Login onLogin={setUsuario} /> : <Navigate to={usuario.tipo === 'administrador' ? "/dashboard" : "/dashFuncionario"} />} />
        
        <Route path="/dashboard/*" element={usuario?.tipo === 'administrador' ? (
          <DashboardLayout onLogout={() => {
            localStorage.clear();
            setUsuario(null);
          }} />
        ) : (
          <Navigate to="/" />
        )} />

        <Route path="/dashFuncionario/*" element={usuario?.tipo === 'funcionario' ? (
          <DashFuncionario onLogout={() => {
            localStorage.clear();
            setUsuario(null);
          }} />
        ) : (
          <Navigate to="/" />
        )} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
