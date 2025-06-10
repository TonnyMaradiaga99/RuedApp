const express = require('express');
const router = express.Router();
const tallerCtrl = require('../controllers/taller.controller');

router.post('/', tallerCtrl.crearTaller);
router.get('/', tallerCtrl.obtenerTalleres);
router.put('/:id', tallerCtrl.actualizarTaller);
router.delete('/:id', tallerCtrl.eliminarTaller);

module.exports = router;