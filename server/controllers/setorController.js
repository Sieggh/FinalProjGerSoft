const Setor = require('../models/setor');
const Empresa = require('../models/empresa');
const Usuario = require('../models/usuario');

exports.listarPorEmpresa = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const usuario = await Usuario.findById(idUsuario);

    const setores = await Setor.find({ empresa: usuario.empresa }).sort({ nome: 1 });

    const setoresComQuantidade = await Promise.all(setores.map(async (setor) => {
    const count = await Usuario.countDocuments({ setor: setor._id });
      return {
        id: setor._id,
        nome: setor.nome,
        quantidadeFuncionarios: count
      };
    }));

    res.json(setoresComQuantidade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar setores.' });
  }
};

exports.cadastrarSetor = async (req, res) => {
  const { nome, nomeEmpresa } = req.body;

  if (!nome || !nomeEmpresa) {
    return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    let empresa = await Empresa.findOne({ nome: nomeEmpresa });
    if (!empresa) {
      empresa = new Empresa({ nome: nomeEmpresa });
      await empresa.save();
    }

    const novoSetor = new Setor({ nome, empresa: empresa._id });
    await novoSetor.save();

    res.status(201).json({ msg: 'Setor cadastrado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao cadastrar setor.' });
  }
};
