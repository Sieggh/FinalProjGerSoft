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
    const totalFuncionarios = await Usuario.countDocuments({ empresa: empresa._id, tipo: 'funcionario' });

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

exports.editarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ msg: 'O nome da empresa é obrigatório.' });
    }

    const empresa = await Empresa.findById(id);
    if (!empresa) {
      return res.status(404).json({ msg: 'Empresa não encontrada.' });
    }

    empresa.nome = nome;
    await empresa.save();

    res.status(200).json({ msg: 'Empresa atualizada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao atualizar empresa.' });
  }
};

exports.buscarEmpresaPorId = async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) {
      return res.status(404).json({ msg: 'Empresa não encontrada.' });
    }

    res.status(200).json(empresa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar empresa.' });
  }
};