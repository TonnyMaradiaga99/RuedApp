const Vehiculo = require('../models/Vehiculo');

exports.crearVehiculo = async (req, res) => {
  try {
    const nuevoVehiculo = new Vehiculo(req.body);
    const resultado = await nuevoVehiculo.save();
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.obtenerVehiculos = async (req, res) => {
  const vehiculos = await Vehiculo.find();
  res.json(vehiculos);
};

exports.obtenerVehiculoPorId = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id);
    if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
    res.json(vehiculo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.actualizarVehiculo = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vehiculo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarVehiculo = async (req, res) => {
  try {
    await Vehiculo.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Vehículo eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};