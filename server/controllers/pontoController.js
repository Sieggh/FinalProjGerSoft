const Ponto = require('../models/ponto');
const Usuario = require('../models/usuario');
const { calcularResumoDoDia } = require('../utils/pontoUtils');

exports.registrarPonto = async (req, res) => {
  const idUsuario = req.usuario.id; // vem do authMiddleware
  const agora = new Date();

  // Normaliza a data para 00:00:00 (apenas o dia)
  const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());

  try {
    let ponto = await Ponto.findOne({
      usuario: idUsuario,
      data: inicioDoDia
    });

    if (!ponto) {
      // Primeiro ponto do dia
      ponto = new Ponto({
        usuario: idUsuario,
        data: inicioDoDia,
        horarios: [agora]
      });
      await ponto.save();
      return res.status(201).json({ msg: 'Ponto registrado (entrada 1).' });
    }

    if (ponto.horarios.length >= 4) {
      return res.status(400).json({ msg: 'Limite de registros de ponto atingido para hoje.' });
    }

    // Adiciona novo horário
    ponto.horarios.push(agora);
    await ponto.save();

    const tipo = ['entrada 1', 'saída 1', 'entrada 2', 'saída 2'][ponto.horarios.length - 1];
    res.status(200).json({ msg: `Ponto registrado (${tipo}).` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao registrar ponto.' });
  }
};

exports.listarMeusPontos = async (req, res) => {
  const idUsuario = req.usuario.id;

  try {
    const pontos = await Ponto.find({ usuario: idUsuario }).sort({ data: -1 });

    const folha = pontos.map(ponto => calcularResumoDoDia(ponto));

    res.json(folha);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao listar pontos.' });
  }
};

exports.listarPontoDeUsuario = async (req, res) => {
  const idAdmin = req.usuario.id;
  const idFuncionario = req.params.id;

  try {
    const admin = await Usuario.findById(idAdmin);
    if (!admin || admin.tipo !== 'administrador') {
      return res.status(403).json({ msg: 'Acesso negado. Apenas administradores.' });
    }

    const funcionario = await Usuario.findById(idFuncionario);
    if (!funcionario) {
      return res.status(404).json({ msg: 'Funcionário não encontrado.' });
    }

    // Verifica se funcionário pertence à mesma empresa do admin
    if (!admin.empresa.equals(funcionario.empresa)) {
      return res.status(403).json({ msg: 'Acesso negado. Funcionário de outra empresa.' });
    }

    const pontos = await Ponto.find({ usuario: idFuncionario }).sort({ data: -1 });

    const folha = pontos.map(ponto => calcularResumoDoDia(ponto));

    res.json({
      funcionario: {
        nome: funcionario.nomeCompleto,
        matricula: funcionario.matricula,
      },
      folha
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao buscar pontos do funcionário.' });
  }
};

const PDFDocument = require('pdfkit');

exports.gerarPdfPontoFuncionario = async (req, res) => {
  const idUsuario = req.usuario.id;
  const isAdmin = req.usuario.tipo === 'administrador';
  const funcionarioId = req.params.id || idUsuario;

  try {
    const usuario = await Usuario.findById(funcionarioId);
    if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado.' });

    // Impede que funcionário baixe PDF de outro
    if (!isAdmin && idUsuario !== funcionarioId) {
      return res.status(403).json({ msg: 'Acesso negado.' });
    }

    const pontos = await Ponto.find({ usuario: funcionarioId }).sort({ data: -1 });
    const folha = pontos.map(calcularResumoDoDia);

    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', `attachment; filename=folha-ponto-${usuario.nomeCompleto}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(18).text(`Folha de Ponto - ${usuario.nomeCompleto}`, { align: 'center' });
    doc.moveDown();

    folha.forEach(p => {
      doc
        .fontSize(12)
        .text(`Data: ${p.data}`)
        .text(`Horários: ${p.horarios.join(', ') || 'Nenhum'}`)
        .text(`Total: ${p.totalHorasTrabalhadas} | Status: ${p.status}`)
        .text(`+ Extra: ${p.extra || '-'} | - Falta: ${p.falta || '-'}`)
        .moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao gerar PDF.' });
  }
};
