const mongoose = require('mongoose');

const ordenServicioSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  vehiculoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehiculo', required: true },
  empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado', required: true },
  fechaIngreso: { type: Date, required: true },
  fechaEstimadaEntrega: Date,
  estado: String,
  diagnostico: String,
  trabajosRealizados: String,
  comentariosAdicionales: String
});

module.exports = mongoose.model('OrdenServicio', ordenServicioSchema);