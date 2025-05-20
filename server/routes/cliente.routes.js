const express = require('express');
const router = express.Router();
const clienteCtrl = require('../controllers/cliente.controller');

router.post('/', clienteCtrl.crearCliente);
router.get('/', clienteCtrl.obtenerClientes);
router.get('/:id', clienteCtrl.obtenerClientePorId);
router.put('/:id', clienteCtrl.actualizarCliente);
router.delete('/:id', clienteCtrl.eliminarCliente);

module.exports = router;
