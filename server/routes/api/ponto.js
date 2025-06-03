const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const pontoController = require('../../controllers/pontoController');

// Rota protegida para registrar ponto
router.post('/registrar', auth, pontoController.registrarPonto);

router.get('/meus', auth, pontoController.listarMeusPontos);

router.get('/usuario/:id', auth, pontoController.listarPontoDeUsuario);

// Funcionário baixa sua folha
router.get('/pdf', auth, pontoController.gerarPdfPontoFuncionario);

// Admin baixa de outro funcionário
router.get('/pdf/:id', auth, pontoController.gerarPdfPontoFuncionario);

module.exports = router;