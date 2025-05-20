const mongoose = require('mongoose');

const inventarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  stock: { type: Number, default: 0 },
  precio: Number,
  proveedor: String
});

module.exports = mongoose.model('Inventario', inventarioSchema);