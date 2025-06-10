const OrdenServicio = require('../models/OrdenServicio');

exports.crearOrdenServicio = async (req, res) => {
  try {
    const nuevaOrden = new OrdenServicio({
      ...req.body,
      historialEstados: [{
        estado: req.body.estado,
        fecha: new Date(),
        comentario: 'Creación de la orden'
      }]
    });
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
    const orden = await OrdenServicio.findById(req.params.id);
    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });

    // Si el estado cambió, agrega al historial
    if (req.body.estado && req.body.estado !== orden.estado) {
      orden.historialEstados.push({
        estado: req.body.estado,
        fecha: new Date(),
        comentario: req.body.comentarioEstado || '',
        montoPresupuesto: req.body.montoPresupuesto // solo si aplica
      });
      // Si es presupuesto, actualiza el campo principal
      if (req.body.estado === 'Aprobación de presupuesto' && req.body.montoPresupuesto) {
        orden.montoPresupuesto = req.body.montoPresupuesto;
      }
    }

    Object.assign(orden, req.body);
    await orden.save();
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