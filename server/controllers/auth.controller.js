const Empleado = require('../models/Empleado');
const jwt = require('jsonwebtoken');

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

    // Generar token JWT
    const token = jwt.sign(
      { id: empleado._id, email: empleado.email, rol: empleado.rol },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '8h' }
    );

    res.json({ token, empleado: { id: empleado._id, nombre: empleado.nombre, rol: empleado.rol } });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};