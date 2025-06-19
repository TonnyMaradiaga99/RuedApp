const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/solicitar-reset-password', authController.solicitarResetPassword);
router.post('/restablecer-password', authController.restablecerPassword);

module.exports = router;