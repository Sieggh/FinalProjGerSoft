const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const tokenLimpo = token.replace('Bearer ', '');
    const decodificado = jwt.verify(tokenLimpo, process.env.JWT_SECRET);

    req.usuario = decodificado; // ID do usuário estará aqui
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
