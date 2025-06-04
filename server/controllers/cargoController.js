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
