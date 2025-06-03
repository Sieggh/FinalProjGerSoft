import React, { useState, useEffect } from 'react';
import Login from './pages/Login';

const App = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('usuario');
    if (user) setUsuario(JSON.parse(user));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null); // volta para tela de login
  };

  return (
    <div>
      {!usuario ? (
        <Login onLogin={setUsuario} />
      ) : (
        <div>
          <h2>Bem-vindo, {usuario.nome || usuario.usuario}</h2>
          <button onClick={handleLogout}>Sair</button>
        </div>
      )}
    </div>
  );
};



export default App;
