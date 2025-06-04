const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const cargoController = require('../../controllers/cargoController');

// GET /api/cargos
router.get('/', authMiddleware, cargoController.listarPorEmpresa);
router.post('/', cargoController.cadastrarCargo);
router.put('/:id', authMiddleware, cargoController.editarCargo);
router.get('/:id', authMiddleware, cargoController.buscarCargoPorId);
router.delete('/:id', authMiddleware, cargoController.excluirCargo);

module.exports = router;
