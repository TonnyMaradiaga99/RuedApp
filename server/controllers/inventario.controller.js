const Inventario = require('../models/Inventario');

exports.crearItem = async (req, res) => {
  try {
    const nuevoItem = new Inventario(req.body);
    const resultado = await nuevoItem.save();
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.obtenerItems = async (req, res) => {
  const items = await Inventario.find();
  res.json(items);
};

exports.obtenerItemPorId = async (req, res) => {
  try {
    const item = await Inventario.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.actualizarItem = async (req, res) => {
  try {
    const item = await Inventario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarItem = async (req, res) => {
  try {
    await Inventario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Item eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};