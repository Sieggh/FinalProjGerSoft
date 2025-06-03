const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const cargoController = require('../../controllers/cargoController');

// GET /api/cargos
router.get('/', authMiddleware, cargoController.listarPorEmpresa);
router.post('/', cargoController.cadastrarCargo);

module.exports = router;
