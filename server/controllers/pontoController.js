const Ponto = require('../models/ponto');
const Usuario = require('../models/usuario');
const { calcularResumoDoDia } = require('../utils/pontoUtils');

exports.registrarPonto = async (req, res) => {
  const id = req.usuario.id;
  const agora = new Date();
  agora.setSeconds(0, 0); // <-- ajusta aqui

  const inicioDoDia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());

  try {
    let ponto = await Ponto.findOne({ usuario: id, data: inicioDoDia });

    if (!ponto) {
      ponto = new Ponto({
        usuario: id,
        data: inicioDoDia,
        horarios: [agora]
      });
      await ponto.save();
      return res.status(201).json({ msg: 'Ponto registrado (entrada 1).' });
    }

    if (ponto.horarios.length >= 4) {
      return res.status(400).json({ msg: 'Limite de registros de ponto atingido para hoje.' });
    }

    const ultimoHorario = ponto.horarios[ponto.horarios.length - 1];
    if (ultimoHorario && (agora - ultimoHorario) < 60 * 1000) {
      return res.status(400).json({ msg: 'Espere um minuto antes de registrar novamente.' });
    }

    ponto.horarios.push(agora);
    await ponto.save();

    const tipo = ['1ª Entrada', '1ª Saída', '2ª Entrada', '2ª Saída'][ponto.horarios.length - 1];
    res.status(200).json({ msg: `Ponto registrado (${tipo}).` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao registrar ponto.' });
  }
};

exports.listarMeusPontos = async (req, res) => {
  const id = req.usuario.id;

  try {
    const pontos = await Ponto.find({ usuario: id }).sort({ data: -1 });

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

exports.inserirPontoManual = async (req, res) => {
  const { id, data, horarios } = req.body;

  if (!id || !data || !Array.isArray(horarios)) {
    return res.status(400).json({ msg: 'Preencha id, data e horarios corretamente.' });
  }

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    // Converte a data para início do dia
    const dataNormalizada = new Date(`${data}T00:00:00`);

    // Converte cada horário para Date
    const horariosConvertidos = horarios.map(h => new Date(`${data}T${h}:00`));

    // Cria ou atualiza o ponto
    let ponto = await Ponto.findOne({ usuario: id, data: dataNormalizada });

    if (ponto) {
      ponto.horarios = horariosConvertidos;
      await ponto.save();
    } else {
      ponto = new Ponto({
        usuario: id,
        data: dataNormalizada,
        horarios: horariosConvertidos
      });
      await ponto.save();
    }

    res.status(200).json({ msg: 'Ponto inserido manualmente com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao inserir ponto manualmente.' });
  }
};

exports.atualizarPontoDoDia = async (req, res) => {
  const { id, data } = req.params;
  const { horarios } = req.body;

  if (!Array.isArray(horarios)) {
    return res.status(400).json({ msg: 'Horários inválidos.' });
  }

  try {
    const dataNormalizada = new Date(`${data}T00:00:00`);

    const horariosConvertidos = horarios
    .filter(h => /^\d{2}:\d{2}$/.test(h))
    .map(h => {
      const [hh, mm] = h.split(':');
      const dt = new Date(`${data}T${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:00`);
      return new Date(dt.getTime()); 
    });

    if (horariosConvertidos.some(h => isNaN(h.getTime()))) {
      return res.status(400).json({ msg: 'Um ou mais horários são inválidos.' });
    }

    let ponto = await Ponto.findOne({ usuario: id, data: dataNormalizada });

    if (!ponto) {
      return res.status(404).json({ msg: 'Ponto não encontrado para esta data.' });
    }

    ponto.horarios = horariosConvertidos;
    await ponto.save();

    res.status(200).json({ msg: 'Ponto atualizado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao atualizar ponto.' });
  }
};

exports.ultimosPontosDoDia = async (req, res) => {
  const idAdmin = req.usuario.id;

  try {
    const admin = await Usuario.findById(idAdmin).populate('empresa');
    if (!admin || admin.tipo !== 'administrador') {
      return res.status(403).json({ msg: 'Acesso negado. Apenas administradores.' });
    }

    const hoje = new Date();
    const inicioDoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    // Buscar usuários da mesma empresa
    const funcionarios = await Usuario.find({ empresa: admin.empresa._id, tipo: 'funcionario' });
    const idsFuncionarios = funcionarios.map(f => f._id);

    // Buscar pontos de hoje desses usuários
    const pontos = await Ponto.find({
      usuario: { $in: idsFuncionarios },
      data: inicioDoDia
    }).populate('usuario');

    // Montar lista com nome, horário e tipo
    let ultimos = [];

    pontos.forEach(ponto => {
      ponto.horarios.forEach((h, i) => {
        ultimos.push({
          nome: ponto.usuario.nomeCompleto,
          horario: h,
          tipo: ['1ª Entrada', '1ª Saída', '2ª Entrada', '2ª Saída'][i]
        });
      });
    });

    // Ordenar por horário (mais recentes primeiro)
    ultimos.sort((a, b) => new Date(b.horario) - new Date(a.horario));

    // Limitar aos últimos 10
    ultimos = ultimos.slice(0, 10);

    // Calcular funcionários ativos
    let ativos = 0;
    for (const ponto of pontos) {
      const qtd = ponto.horarios.length;
      if (qtd === 1 || qtd === 3) ativos++; // só entrada(s), sem saída correspondente
    }

    res.json({ ultimos, ativos });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao carregar dashboard.' });
  }
};