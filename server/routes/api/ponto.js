const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const pontoController = require('../../controllers/pontoController');

// Rota protegida para registrar ponto
router.post('/registrar', authMiddleware, pontoController.registrarPonto);

router.get('/meus', authMiddleware, pontoController.listarMeusPontos);

router.get('/usuario/:id', authMiddleware, pontoController.listarPontoDeUsuario);

// Funcionário baixa sua folha
router.get('/pdf', authMiddleware, pontoController.gerarPdfPontoFuncionario);

// Admin baixa de outro funcionário
router.get('/pdf/:id', authMiddleware, pontoController.gerarPdfPontoFuncionario);

module.exports = router;