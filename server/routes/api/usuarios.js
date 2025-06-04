const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/usuarioController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const authMiddleware = require('../../middlewares/authMiddleware');

// POST /api/usuarios/admin
router.post('/admin', authMiddleware, usuarioController.cadastrarAdministrador);
router.put('/admin', authMiddleware, usuarioController.atualizarAdministrador);
router.get('/administradores', authMiddleware, usuarioController.listarAdministradores);

// POST /api/usuarios/funcionario
router.post('/funcionario', authMiddleware, usuarioController.cadastrarFuncionario);
router.get('/', authMiddleware, usuarioController.listarUsuarios);
router.delete('/funcionario/:id', authMiddleware, usuarioController.excluirFuncionario);
router.put('/funcionario/:id', authMiddleware, usuarioController.editarFuncionario);
router.get('/funcionario/:id', authMiddleware, usuarioController.buscarFuncionarioPorId);

// POST /api/usuarios/login
router.post('/login', usuarioController.login);


module.exports = router;
