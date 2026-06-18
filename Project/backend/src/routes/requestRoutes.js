const express = require("express");
const router = express.Router();
const multer = require("multer"); // 🟢 Importar o multer

// Configuração para processar os ficheiros na pasta temporária 'uploads/'
const upload = multer({ dest: "uploads/" }); 

const requestController = require("../controllers/requestController");

// Rotas de leitura (GET)
router.get('/requests', requestController.request_list);
router.get('/requests/files', requestController.request_files_list);
router.get('/requests/files/download/:id', requestController.request_file_download);
router.get('/requests/:id', requestController.request_detail);

// 🟢 CORREÇÃO: O 'upload.single('file')' TEM de estar aqui inserido!
// É este comando que pega no FormData do teu React, extrai o ficheiro e preenche o 'req.body'
router.post('/requests/create', upload.single('file'), requestController.request_create);
router.post('/requests', upload.single('file'), requestController.request_create);

// Rotas de modificação e remoção (PUT / DELETE)
router.put('/requests/:id', requestController.request_update);
router.delete('/requests/:id', requestController.request_delete);
router.put('/requests/:id/close', requestController.request_close);

module.exports = router;