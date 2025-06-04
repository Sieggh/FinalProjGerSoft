const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/usuarioController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const authMiddleware = require('../../middlewares/authMiddleware');
const importController = require('../../controllers/importController');

// POST /api/usuarios/admin
router.post('/admin', usuarioController.cadastrarAdministrador);
router.put('/admin', authMiddleware, usuarioController.atualizarAdministrador);
router.get('/administradores', authMiddleware, usuarioController.listarAdministradores);

// POST /api/usuarios/funcionario
router.post('/funcionario', usuarioController.cadastrarFuncionario);

// POST /api/usuarios/login
router.post('/login', usuarioController.login);

router.post('/importar', authMiddleware, upload.single('arquivo'), importController.importarFuncionarios);

router.get('/listar', authMiddleware, usuarioController.listarUsuarios);

module.exports = router;
