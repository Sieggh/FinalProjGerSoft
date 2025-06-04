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

exports.editarSetor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ msg: 'Nome do setor é obrigatório.' });
    }

    const setor = await Setor.findById(id);
    if (!setor) {
      return res.status(404).json({ msg: 'Setor não encontrado.' });
    }

    setor.nome = nome;
    await setor.save();

    res.status(200).json({ msg: 'Setor atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao atualizar setor.' });
  }
};

exports.buscarSetorPorId = async (req, res) => {
  try {
    const setor = await Setor.findById(req.params.id).populate('empresa', 'nome');
    
    if (!setor) {
      return res.status(404).json({ msg: 'Setor não encontrado.' });
    }

    res.status(200).json(setor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar setor.' });
  }
};

exports.excluirSetor = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se existe algum usuário vinculado a esse setor
    const existeUsuario = await Usuario.findOne({ setor: id });
    if (existeUsuario) {
      return res.status(400).json({ msg: 'Não é possível excluir. Há usuários vinculados a este setor.' });
    }

    await Setor.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Setor excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao excluir setor.' });
  }
};