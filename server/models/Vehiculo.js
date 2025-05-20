const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  año: Number,
  placa: String,
  color: String,
  kilometraje: Number,
  VIN: String
});

module.exports = mongoose.model('Vehiculo', vehiculoSchema);