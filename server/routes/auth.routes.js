const express = require('express');
const router = express.Router();
const Empleado = require('../models/Empleado');

// Login básico
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const empleado = await Empleado.findOne({ email });
    if (!empleado) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    // Comparación directa, luego se recomienda usar bcrypt
    if (empleado.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    res.json({ message: 'Login exitoso', empleado });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;