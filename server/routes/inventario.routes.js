const express = require('express');
const router = express.Router();
const inventarioCtrl = require('../controllers/inventario.controller');

router.post('/', inventarioCtrl.crearItem);
router.get('/', inventarioCtrl.obtenerItems);
router.get('/:id', inventarioCtrl.obtenerItemPorId);
router.put('/:id', inventarioCtrl.actualizarItem);
router.delete('/:id', inventarioCtrl.eliminarItem);

module.exports = router;