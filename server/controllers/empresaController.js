const Empresa = require('../models/empresa');
const Usuario = require('../models/usuario');

exports.listarPorEmpresa = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const usuario = await Usuario.findById(idUsuario);

    // Busca a empresa do usuário logado
    const empresa = await Empresa.findById(usuario.empresa);

    if (!empresa) {
      return res.status(404).json({ msg: 'Empresa não encontrada.' });
    }

    // Conta quantos funcionários existem na empresa
    const totalFuncionarios = await Usuario.countDocuments({ empresa: empresa._id });

    const empresaComTotal = [{
      id: empresa._id,
      nome: empresa.nome,
      totalFuncionarios
    }];

    res.json(empresaComTotal);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar empresa.' });
  }
};
