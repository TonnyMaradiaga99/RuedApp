const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Empleado = require('../models/Empleado');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ruedapp504@gmail.com', 
    pass: 'lkyu xzmv zief lmwl'           
  }
});

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const empleado = await Empleado.findOne({ email });
    if (!empleado) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const esValido = await empleado.compararPassword(password);
    if (!esValido) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: empleado._id, email: empleado.email, rol: empleado.rol },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '8h' }
    );

    res.json({ token, empleado: { id: empleado._id, nombre: empleado.nombre, apellido: empleado.apellido, rol: empleado.rol } });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.solicitarResetPassword = async (req, res) => {
  const { email } = req.body;
  const empleado = await Empleado.findOne({ email });
  if (!empleado) return res.status(404).json({ error: 'Usuario no encontrado' });

  const token = Math.floor(100000 + Math.random() * 900000).toString();


  empleado.resetPasswordToken = token;
  empleado.resetPasswordExpires = Date.now() + 3600000;
  await empleado.save();

  const mailOptions = {
    to: empleado.email,
    subject: 'Restablece tu contraseña',
    text: `Tu código de recuperación es: ${token}`
  };

  await transporter.sendMail(mailOptions);

  res.json({ message: 'Correo enviado' });
};

exports.restablecerPassword = async (req, res) => {
  const { email, token, nuevaPassword } = req.body;
  try {
    const empleado = await Empleado.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!empleado) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    empleado.password = nuevaPassword;
    empleado.markModified('password');
    empleado.resetPasswordToken = undefined;
    empleado.resetPasswordExpires = undefined;
    await empleado.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};