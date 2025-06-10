const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const empleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  rol: String,
  especialidad: String,
  telefono: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tallerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Taller' }
});

empleadoSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

empleadoSchema.methods.compararPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Empleado', empleadoSchema);