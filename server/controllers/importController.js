const fs = require('fs');
const XLSX = require('xlsx');
const Usuario = require('../models/usuario');
const Cargo = require('../models/cargo');
const Setor = require('../models/setor');
const Empresa = require('../models/empresa');
const bcrypt = require('bcrypt');

exports.importarFuncionarios = async (req, res) => {
  
  try {
    const caminhoArquivo = req.file.path;
    const workbook = XLSX.readFile(caminhoArquivo);
    const sheetName = workbook.SheetNames[0];
    const dados = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let totalCadastrados = 0;
    let erros = [];

    for (const linha of dados) {
      const {
        nomeCompleto,
        cpf,
        matricula,
        dataAdmissao,
        senha,
        nomeEmpresa,
        nomeCargo,
        nomeSetor
      } = linha;

      if (!matricula || !senha || !nomeEmpresa || !nomeCargo || !nomeSetor || !nomeCompleto || !cpf || !dataAdmissao) {
        erros.push({ matricula: linha.matricula || 'desconhecida', motivo: 'Campos obrigatórios faltando' });
        continue;
      }

      const existeMatricula = await Usuario.findOne({ matricula });

      if (existeMatricula) {
        erros.push({ matricula, motivo: 'Usuário já existe' });
        continue;
      }

      let empresa = await Empresa.findOne({ nome: nomeEmpresa });
      if (!empresa) {
        empresa = new Empresa({ nome: nomeEmpresa });
        await empresa.save();
      }

      let cargo = await Cargo.findOne({ nome: nomeCargo, empresa: empresa._id });
      if (!cargo) {
        cargo = new Cargo({ nome: nomeCargo, empresa: empresa._id });
        await cargo.save();
      }

      let setor = await Setor.findOne({ nome: nomeSetor, empresa: empresa._id });
      if (!setor) {
        setor = new Setor({ nome: nomeSetor, empresa: empresa._id });
        await setor.save();
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novo = new Usuario({
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

      await novo.save();
      totalCadastrados++;
    }

    fs.unlinkSync(caminhoArquivo); // remove o arquivo após o processamento

    res.status(200).json({
      msg: 'Importação concluída',
      totalCadastrados,
      totalErros: erros.length,
      erros
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao importar funcionários.' });
  }
};
