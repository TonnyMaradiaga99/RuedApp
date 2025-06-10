const Taller = require('../models/Taller');

exports.crearTaller = async (req, res) => {
  try {
    const taller = new Taller(req.body);
    await taller.save();
    res.status(201).json(taller);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.obtenerTalleres = async (req, res) => {
  const talleres = await Taller.find();
  res.json(talleres);
};

exports.actualizarTaller = async (req, res) => {
  try {
    const taller = await Taller.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(taller);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarTaller = async (req, res) => {
  try {
    await Taller.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Taller eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};