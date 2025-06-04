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

    // Cria usuário administrador
    const novoUsuario = new Usuario({
      tipo: 'administrador',
      email,
      senha: senha,
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

    // Cria usuário funcionário
    const novoFuncionario = new Usuario({
      tipo: 'funcionario',
      nomeCompleto,
      cpf,
      matricula,
      dataAdmissao,
      senha: senha,
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

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarioLogado = await Usuario.findById(req.usuario.id);

    if (!usuarioLogado || !usuarioLogado.empresa) {
      return res.status(403).json({ msg: 'Usuário sem empresa associada.' });
    }

    const usuarios = await Usuario.find({ empresa: usuarioLogado.empresa, tipo: 'funcionario' })
      .populate('cargo', 'nome')
      .populate('setor', 'nome')
      .populate('empresa', 'nome')
      .select('nomeCompleto matricula tipo cargo setor empresa');

    const formatados = usuarios.map((u) => ({
      id: u._id,
      nomeCompleto: u.nomeCompleto,
      matricula: u.matricula || '—',
      tipo: u.tipo,
      empresa: u.empresa?.nome || '—',
      cargo: u.cargo?.nome || '—',
      setor: u.setor?.nome || '—',
    }));



    res.json(formatados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar usuários.' });
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
        email: usuario.email,
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

exports.atualizarAdministrador = async (req, res) => {
  const userId = req.usuario.id;
  const { nomeCompleto, email, senha } = req.body;

  try {
    const atualizacoes = { nomeCompleto, email };

    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      atualizacoes.senha = senhaHash;
    }

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      userId,
      { $set: atualizacoes },
      { new: true }
    );

    res.json({
      msg: 'Administrador atualizado com sucesso.',
      usuario: {
        id: usuarioAtualizado._id,
        nome: usuarioAtualizado.nomeCompleto,
        email: usuarioAtualizado.email,
        tipo: usuarioAtualizado.tipo,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao atualizar administrador.' });
  }
};

exports.listarAdministradores = async (req, res) => {
  try {
    const usuarioLogado = await Usuario.findById(req.usuario.id);

    if (!usuarioLogado || !usuarioLogado.empresa) {
      return res.status(403).json({ msg: 'Usuário sem empresa associada.' });
    }

    const admins = await Usuario.find({ tipo: 'administrador', empresa: usuarioLogado.empresa })
      .select('nomeCompleto email empresa');

    const formatados = admins.map((admin) => ({
      id: admin._id,
      nomeCompleto: admin.nomeCompleto,
      email: admin.email || '—',
    }));

    res.json(formatados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar administradores.' });
  }
};

exports.excluirFuncionario = async (req, res) => {
  try {
    const { id } = req.params;

    const funcionario = await Usuario.findById(id);

    if (!funcionario) {
      return res.status(404).json({ msg: 'Funcionário não encontrado.' });
    }

    if (funcionario.tipo !== 'funcionario') {
      return res.status(403).json({ msg: 'Você só pode excluir funcionários.' });
    }

    await funcionario.deleteOne();

    res.status(200).json({ msg: 'Funcionário excluído com sucesso.' });
  } catch (err) {
  console.error('Erro ao excluir funcionário:', err);
  res.status(500).json({ msg: 'Erro ao excluir funcionário.' });
}
};

// controllers/usuarioController.js

exports.editarFuncionario = async (req, res) => {
  const { id } = req.params;
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

  if (!nomeCompleto || !cpf || !matricula || !dataAdmissao || !nomeEmpresa || !nomeCargo || !nomeSetor) {
    return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    const funcionario = await Usuario.findById(id);
    if (!funcionario) {
      return res.status(404).json({ msg: 'Funcionário não encontrado.' });
    }

    // Verifica empresa
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

    // Atualiza dados
    funcionario.nomeCompleto = nomeCompleto;
    funcionario.cpf = cpf;
    funcionario.matricula = matricula;
    funcionario.dataAdmissao = dataAdmissao;
    funcionario.empresa = empresa._id;
    funcionario.cargo = cargo._id;
    funcionario.setor = setor._id;

    if (senha && senha.trim() !== '') {
      funcionario.senha = senha; // será criptografada via pre-save
    }

    await funcionario.save();

    res.status(200).json({ msg: 'Funcionário atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao editar funcionário:', err);
    res.status(500).json({ msg: 'Erro ao editar funcionário.' });
  }
};

exports.buscarFuncionarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const funcionario = await Usuario.findById(id)
      .populate('cargo', 'nome _id')
      .populate('setor', 'nome _id')
      .populate('empresa', 'nome');

    if (!funcionario || funcionario.tipo !== 'funcionario') {
      return res.status(404).json({ msg: 'Funcionário não encontrado.' });
    }

    res.status(200).json({
      nomeCompleto: funcionario.nomeCompleto,
      cpf: funcionario.cpf,
      matricula: funcionario.matricula,
      dataAdmissao: funcionario.dataAdmissao,
      empresa: funcionario.empresa?.nome || '',
      nomeCargo: funcionario.cargo?.nome || '',
      idCargo: funcionario.cargo?._id || '',
      nomeSetor: funcionario.setor?.nome || '',
      idSetor: funcionario.setor?._id || ''
    });
  } catch (err) {
    console.error('Erro ao buscar funcionário:', err);
    res.status(500).json({ msg: 'Erro ao buscar funcionário.' });
  }
};

