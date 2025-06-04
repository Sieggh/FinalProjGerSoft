const express = require('express');
const router = express.Router();
const empresaController = require('../../controllers/empresaController');
const auth = require('../../middlewares/authMiddleware');

router.get('/', auth, empresaController.listarPorEmpresa);

module.exports = router;
