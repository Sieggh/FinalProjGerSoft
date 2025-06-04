const express = require('express');
const router = express.Router();
const setorController = require('../../controllers/setorController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get('/', authMiddleware, setorController.listarPorEmpresa);
router.post('/', setorController.cadastrarSetor);
router.put('/:id', authMiddleware, setorController.editarSetor);
router.get('/:id', authMiddleware, setorController.buscarSetorPorId);
router.delete('/:id', authMiddleware, setorController.excluirSetor);

module.exports = router;