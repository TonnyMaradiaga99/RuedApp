const OrdenServicio = require('../models/OrdenServicio');

exports.crearOrdenServicio = async (req, res) => {
  try {
    const nuevaOrden = new OrdenServicio(req.body);
    const resultado = await nuevaOrden.save();
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.obtenerOrdenesServicio = async (req, res) => {
  const ordenes = await OrdenServicio.find();
  res.json(ordenes);
};

exports.obtenerOrdenServicioPorId = async (req, res) => {
  try {
    const orden = await OrdenServicio.findById(req.params.id);
    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(orden);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.actualizarOrdenServicio = async (req, res) => {
  try {
    const orden = await OrdenServicio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(orden);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarOrdenServicio = async (req, res) => {
  try {
    await OrdenServicio.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Orden eliminada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};