const mongoose = require('mongoose');
const OrdenServicio = require('../models/OrdenServicio');
const nodemailer = require('nodemailer');
const Cliente = require('../models/Cliente');
const Empleado = require('../models/Empleado');

exports.crearOrdenServicio = async (req, res) => {
  try {
    // Si hay fotos, toma la primera (o puedes guardar todas si quieres)
    const fotoRecepcion = req.body.fotos && req.body.fotos.length > 0 ? req.body.fotos[0] : null;

    const nuevaOrden = new OrdenServicio({
      ...req.body,
      fotos: [], // <-- NO guardes la foto aquí al crear la orden
      historialEstados: [{
        estado: req.body.estado || 'Recepción',
        fecha: new Date(),
        comentario: 'Creación de la orden',
        foto: fotoRecepcion // <-- aquí se guarda la foto en el historial
      }]
    });
    const resultado = await nuevaOrden.save();
    res.status(201).json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.obtenerOrdenesServicio = async (req, res) => {
  try {
    let filtro = {};
    if (req.user.rol !== 'admin' && req.user.rol !== 'propietario') {
      if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
        return res.status(400).json({ error: 'ID de usuario inválido' });
      }
      filtro = { empleadoId: req.user.id }; 
    }
    const ordenes = await OrdenServicio.find(filtro);
    res.json(ordenes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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

    const estados = [
      'Recepción',
      'Diagnóstico',
      'Aprobación de presupuesto',
      'En reparación',
      'Listo para entrega',
      'Entregado',
      'Finalizado',
      'Cancelado'
    ];
    const estadoNuevo = (req.body.estado || '').trim();
    const idxActual = estados.indexOf(orden.estado);
    const idxNuevo = estados.indexOf(estadoNuevo);

    if (idxNuevo === -1) {
      return res.status(400).json({ error: 'Estado no válido.' });
    }

    // Permitir cancelar desde cualquier estado
    if (estadoNuevo.toLowerCase() !== 'cancelado' && idxNuevo !== idxActual + 1) {
      return res.status(400).json({ error: 'Debes avanzar al siguiente estado en orden o cancelar.' });
    }

    // Agrega al historial
    orden.historialEstados.push({
      estado: estadoNuevo,
      fecha: new Date(),
      comentario: req.body.comentarioEstado || '',
      foto: req.body.fotoEstado || null,
      usuario: req.user._id // <-- asigna el usuario autenticado
    });

    orden.estado = estadoNuevo;
    await orden.save();

    // 1. Obtén el cliente y el mecánico
    const cliente = await Cliente.findById(orden.clienteId);
    const mecanico = await Empleado.findById(orden.empleadoId);
    const ultimoHistorial = orden.historialEstados[orden.historialEstados.length - 1];

    const fotoUrl = ultimoHistorial.foto
      ? `http://localhost:3000${ultimoHistorial.foto}`
      : null;

    const html = `
      <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 24px;">
        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(30,60,114,0.08); padding: 32px;">
          <div style="text-align: center; margin-bottom: 18px;">
            <img src="https://i.imgur.com/4M7IWwP.png" alt="RuedApp" style="width: 80px; margin-bottom: 8px;" />
            <h2 style="color: #1e3c72; margin: 0;">Actualización de tu Orden de Servicio</h2>
          </div>
          <p>Hola <b>${cliente.nombre}</b>,</p>
          <p>Tu orden de servicio ha cambiado de estado:</p>
          <ul style="list-style:none; padding:0;">
            <li><b>Estado:</b> ${ultimoHistorial.estado}</li>
            <li><b>Mecánico:</b> ${mecanico ? mecanico.nombre + ' ' + mecanico.apellido : 'Mecánico'}</li>
            <li><b>Comentario:</b> ${ultimoHistorial.comentario || 'Sin comentario'}</li>
          </ul>
          ${
            fotoUrl
              ? `<div style="margin: 18px 0;">
                  <p style="margin-bottom: 8px;"><b>Foto adjunta:</b></p>
                  <a href="${fotoUrl}" target="_blank" style="display:inline-block;">
                    <img src="${fotoUrl}" alt="Foto de avance" style="max-width: 100%; border-radius: 8px; box-shadow:0 2px 8px rgba(30,60,114,0.08);" />
                  </a>
                  <p style="font-size: 0.95em; margin-top: 6px;">
                    <a href="${fotoUrl}" target="_blank" style="color: #1e3c72;">Ver foto en el navegador</a>
                  </p>
                </div>`
              : ''
          }
          <p style="margin-top: 24px; color: #888; font-size: 0.95em;">
            Si tienes dudas, responde a este correo o comunícate con tu taller.<br>
            ¡Gracias por confiar en <b>RuedApp</b>!
          </p>
        </div>
      </div>
    `;

    // 3. Configura el transporter (ajusta según tu SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ruedapp504@gmail.com', 
        pass: 'lkyu xzmv zief lmwl'      
      }
    });

    await transporter.sendMail({
      to: cliente.email,
      subject: 'Actualización de tu Orden de Servicio',
      html
    });

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