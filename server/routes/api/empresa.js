const express = require('express');
const router = express.Router();
const empresaController = require('../../controllers/empresaController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/', authMiddleware, empresaController.listarPorEmpresa);
router.put('/:id', authMiddleware, empresaController.editarEmpresa);
router.get('/:id', authMiddleware, empresaController.buscarEmpresaPorId);

module.exports = router;
