const Usuario = require('../models/usuario');
const Empresa = require('../models/empresa');
const Cargo = require('../models/cargo');
const Setor = require('../models/setor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.cadastrarAdministrador = async (req, res) => {
  const { nomeCompleto, email, senha, nomeEmpresa } = req.body;

  if (!email || !senha || !nomeCompleto || !nomeEmpresa) {
    return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    // Verifica se já existe email ou nome de usuário cadastrado
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) return res.status(400).json({ msg: 'Email já cadastrado.' });

    // Cria ou busca empresa
    let empresa = await Empresa.findOne({ nome: nomeEmpresa });
    if (!empresa) {
      empresa = new Empresa({ nome: nomeEmpresa });
      await empresa.save();
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria usuário administrador
    const novoUsuario = new Usuario({
      tipo: 'administrador',
      email,
      senha: senhaHash,
      nomeCompleto,
      empresa: empresa._id
    });

    await novoUsuario.save();

    res.status(201).json({ msg: 'Administrador cadastrado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao cadastrar administrador.' });
  }
};

exports.cadastrarFuncionario = async (req, res) => {
  const {
    nomeCompleto,
    cpf,
    matricula,
    dataAdmissao,
    senha,
    nomeEmpresa,
    nomeCargo,
    nomeSetor
  } = req.body;

  if (
    !nomeCompleto || !cpf || !matricula || !dataAdmissao
    || !senha || !nomeEmpresa || !nomeCargo || !nomeSetor
  ) {
    return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    const existeMatricula = await Usuario.findOne({ matricula });
    if (existeMatricula) return res.status(400).json({ msg: 'Matrícula já cadastrada.' });

    // Verifica ou cria empresa
    let empresa = await Empresa.findOne({ nome: nomeEmpresa });
    if (!empresa) {
      empresa = new Empresa({ nome: nomeEmpresa });
      await empresa.save();
    }

    // Verifica ou cria cargo
    let cargo = await Cargo.findOne({ nome: nomeCargo, empresa: empresa._id });
    if (!cargo) {
      cargo = new Cargo({ nome: nomeCargo, empresa: empresa._id });
      await cargo.save();
    }

    // Verifica ou cria setor
    let setor = await Setor.findOne({ nome: nomeSetor, empresa: empresa._id });
    if (!setor) {
      setor = new Setor({ nome: nomeSetor, empresa: empresa._id });
      await setor.save();
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria usuário funcionário
    const novoFuncionario = new Usuario({
      tipo: 'funcionario',
      nomeCompleto,
      cpf,
      matricula,
      dataAdmissao,
      senha: senhaHash,
      empresa: empresa._id,
      cargo: cargo._id,
      setor: setor._id
    });

    await novoFuncionario.save();

    res.status(201).json({ msg: 'Funcionário cadastrado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao cadastrar funcionário.' });
  }
};

exports.login = async (req, res) => {
  const { email, matricula, senha } = req.body;

  if ((!email && !matricula) || !senha) {
    return res.status(400).json({ msg: 'Informe matrícula (ou e-mail para administrador) e senha.' });
  }

  try {
    let usuario;

    if (email) {
      usuario = await Usuario.findOne({ email }).populate('empresa cargo setor');
    } else {
      usuario = await Usuario.findOne({ matricula }).populate('empresa cargo setor');
    }

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }
    if (usuario.tipo === 'administrador' && !email) {
      return res.status(400).json({ msg: 'Administradores devem usar o e-mail para login.' });
    }

    if (usuario.tipo === 'funcionario' && !matricula) {
      return res.status(400).json({ msg: 'Funcionários devem usar matrícula para login.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ msg: 'Senha incorreta.' });
    }

    // Cria o token com ID e tipo de usuário
    const token = jwt.sign(
      { id: usuario._id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Retorna os dados do usuário junto com o token
    res.json({
      token,
      usuario: {
        id: usuario._id,
        tipo: usuario.tipo,
        nome: usuario.nomeCompleto,
        empresa: usuario.empresa?.nome,
        cargo: usuario.cargo?.nome,
        setor: usuario.setor?.nome
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao fazer login.' });
  }
};
