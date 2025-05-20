const express = require('express');
const router = express.Router();
const vehiculoCtrl = require('../controllers/vehiculo.controller');

router.post('/', vehiculoCtrl.crearVehiculo);
router.get('/', vehiculoCtrl.obtenerVehiculos);
router.get('/:id', vehiculoCtrl.obtenerVehiculoPorId);
router.put('/:id', vehiculoCtrl.actualizarVehiculo);
router.delete('/:id', vehiculoCtrl.eliminarVehiculo);

module.exports = router;