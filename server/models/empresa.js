const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Empresa', EmpresaSchema);