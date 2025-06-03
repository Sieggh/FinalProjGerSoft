const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const upload = require('../../middlewares/upload');
const importController = require('../../controllers/importController');

// Rota protegida para admin importar planilha
router.post('/funcionarios', auth, upload.single('arquivo'), importController.importarFuncionarios);

module.exports = router;
