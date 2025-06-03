const express = require('express');
const router = express.Router();
const setorController = require('../../controllers/setorController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/', authMiddleware, setorController.listarPorEmpresa);
router.post('/', setorController.cadastrarSetor);

module.exports = router;