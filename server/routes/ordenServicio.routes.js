const express = require('express');
const router = express.Router();
const ordenCtrl = require('../controllers/ordenServicio.controller');

router.post('/', ordenCtrl.crearOrdenServicio);
router.get('/', ordenCtrl.obtenerOrdenesServicio);
router.get('/:id', ordenCtrl.obtenerOrdenServicioPorId);
router.put('/:id', ordenCtrl.actualizarOrdenServicio);
router.delete('/:id', ordenCtrl.eliminarOrdenServicio);

module.exports = router;