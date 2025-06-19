const Empleado = require('../models/Empleado');
const bcrypt = require('bcrypt');

exports.crearEmpleado = async (req, res) => {
  try {
    const nuevoEmpleado = new Empleado(req.body);
    const resultado = await nuevoEmpleado.save();
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.obtenerEmpleados = async (req, res) => {
  const empleados = await Empleado.find();
  res.json(empleados);
};

exports.obtenerEmpleadoPorId = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.actualizarEmpleado = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Si se está cambiando la contraseña, hashearla antes de guardar
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      // Si no se envía contraseña, no actualizar ese campo
      delete updateData.password;
    }

    const empleado = await Empleado.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(empleado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarEmpleado = async (req, res) => {
  try {
    await Empleado.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Empleado eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};