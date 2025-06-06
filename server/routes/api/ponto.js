const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const pontoController = require('../../controllers/pontoController');

// Rota protegida para registrar ponto
router.post('/registrar', authMiddleware, pontoController.registrarPonto);

router.get('/meus', authMiddleware, pontoController.listarMeusPontos);

router.get('/usuario/:id', authMiddleware, pontoController.listarPontoDeUsuario);

router.post('/manual', authMiddleware, pontoController.inserirPontoManual);

router.put('/atualizar/:id/:data', authMiddleware, pontoController.atualizarPontoDoDia);

router.get('/ultimos', authMiddleware, pontoController.ultimosPontosDoDia);

module.exports = router;