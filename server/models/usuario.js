const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['administrador', 'funcionario'], required: true },
  nomeCompleto: { type: String },
  cpf: { type: String },
  matricula: { type: String },
  dataAdmissao: { type: Date },
  email: { type: String, unique: true },
  senha: { type: String, required: true },
  cargo: { type: mongoose.Schema.Types.ObjectId, ref: 'Cargo' },
  setor: { type: mongoose.Schema.Types.ObjectId, ref: 'Setor' },
  empresa: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa', required: true },
}, { timestamps: true });

// Criptografa a senha antes de salvar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  this.senha = await bcrypt.hash(this.senha, 10);
  next();
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
