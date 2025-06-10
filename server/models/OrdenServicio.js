const mongoose = require('mongoose');

const historialEstadoSchema = new mongoose.Schema({
  estado: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  comentario: String,
  montoPresupuesto: Number // Solo si aplica para ese estado
});

const ordenServicioSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  vehiculoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehiculo', required: true },
  empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado', required: true },
  fechaIngreso: { type: Date, required: true },
  fechaEstimadaEntrega: Date,
  estado: {
    type: String,
    enum: [
      'Recepción',
      'Diagnóstico',
      'Aprobación de presupuesto',
      'En reparación',
      'Listo para entrega',
      'Entregado',
      'Finalizado',
      'Cancelado'
    ],
    default: 'Recepción'
  },
  diagnostico: String,
  trabajosRealizados: String,
  comentariosAdicionales: String,
  fotos: [String],
  historialEstados: [historialEstadoSchema],
  montoPresupuesto: Number // último monto aprobado
});

module.exports = mongoose.model('OrdenServicio', ordenServicioSchema);