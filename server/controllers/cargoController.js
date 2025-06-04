const Cargo = require('../models/cargo');
const Usuario = require('../models/usuario');
const Empresa = require('../models/empresa');


exports.listarPorEmpresa = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const usuario = await Usuario.findById(idUsuario);

    const cargos = await Cargo.find({ empresa: usuario.empresa }).sort({ nome: 1 });

    const cargosComQuantidade = await Promise.all(cargos.map(async (cargo) => {
    const count = await Usuario.countDocuments({ cargo: cargo._id });
      return {
        id: cargo._id,
        nome: cargo.nome,
        quantidadeFuncionarios: count
      };
    }));

    res.json(cargosComQuantidade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar cargos.' });
  }
};

exports.cadastrarCargo = async (req, res) => {
  const { nome, nomeEmpresa } = req.body;

  if (!nome || !nomeEmpresa) {
    return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    // Verifica ou cria a empresa
    let empresa = await Empresa.findOne({ nome: nomeEmpresa });
    if (!empresa) {
      empresa = new Empresa({ nome: nomeEmpresa });
      await empresa.save();
    }

    // Verifica se já existe o cargo para essa empresa
    const cargoExistente = await Cargo.findOne({ nome, empresa: empresa._id });
    if (cargoExistente) {
      return res.status(400).json({ msg: 'Cargo já cadastrado para essa empresa.' });
    }

    // Cria o novo cargo
    const novoCargo = new Cargo({
      nome,
      empresa: empresa._id
    });

    await novoCargo.save();

    res.status(201).json({ msg: 'Cargo cadastrado com sucesso.', cargo: novoCargo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao cadastrar cargo.' });
  }
};

exports.editarCargo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ msg: 'Nome do cargo é obrigatório.' });
    }

    const cargo = await Cargo.findById(id);
    if (!cargo) {
      return res.status(404).json({ msg: 'Cargo não encontrado.' });
    }

    cargo.nome = nome;
    await cargo.save();

    res.status(200).json({ msg: 'Cargo atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao atualizar cargo.' });
  }
};

exports.buscarCargoPorId = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id).populate('empresa', 'nome');
    if (!cargo) {
      return res.status(404).json({ msg: 'Cargo não encontrado.' });
    }

    res.status(200).json(cargo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar cargo.' });
  }
};

exports.excluirCargo = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se existe algum usuário vinculado a esse cargo
    const existeUsuario = await Usuario.findOne({ cargo: id });
    if (existeUsuario) {
      return res.status(400).json({ msg: 'Não é possível excluir. Há usuários vinculados a este cargo.' });
    }

    await Cargo.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Cargo excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao excluir cargo.' });
  }
};