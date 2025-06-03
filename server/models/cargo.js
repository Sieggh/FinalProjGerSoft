const mongoose = require('mongoose');

const CargoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  empresa: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresa', required: true },
});

module.exports = mongoose.model('Cargo', CargoSchema);