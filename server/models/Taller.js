const mongoose = require('mongoose');

const tallerSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: String,
  telefono: String,
});

module.exports = mongoose.model('Taller', tallerSchema);