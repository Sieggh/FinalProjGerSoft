const mongoose = require('mongoose');

const PontoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  data: { type: Date, required: true }, // Apenas a data, sem hora
  horarios: [{ type: Date }] // Até 4 horários no dia
}, {
  timestamps: true
});

module.exports = mongoose.model('Ponto', PontoSchema);
