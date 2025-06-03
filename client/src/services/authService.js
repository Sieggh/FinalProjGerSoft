import axios from 'axios';

export const loginUsuario = async (identificador, senha) => {
  try {
    const isEmail = identificador.includes('@');

    const res = await axios.post('http://localhost:4000/api/usuarios/login', {
      [isEmail ? 'email' : 'matricula']: identificador,
      senha
    });

    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.msg || 'Erro ao fazer login');
  }
};
