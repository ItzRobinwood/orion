const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const requestController = require("../controllers/requestController");

// ==========================================
// 1. ROTAS DE LEITURA (GET) - Ordem Limpa
// ==========================================
router.get('/requests', requestController.request_list);
router.get('/requests/files', requestController.request_files_list);
router.get('/requests/files/download/:id', requestController.request_file_download);
// 🟢 Opcional/Segurança: O :id geral fica por baixo das sub-rotas GET
router.get('/requests/:id', requestController.request_detail);

// ==========================================
// 2. ROTAS DE CRIAÇÃO (POST)
// ==========================================
router.post('/requests/create', upload.single('file'), requestController.request_create);
router.post('/requests', upload.single('file'), requestController.request_create);

// ==========================================
// 3. ROTAS DE MODIFICAÇÃO ESPECÍFICAS (PUT)
// ==========================================
// 🟢 NOTA CRÍTICA: Estas têm de vir ANTES do /requests/:id genérico,
// caso contrário o Express intercepta "assign" ou "close" como lixo do :id!
router.put('/requests/:id/assign', requestController.assign_manager);
router.put('/requests/:id/close', requestController.request_close);

// ==========================================
// 4. ROTAS DE MODIFICAÇÃO E REMOÇÃO GERAIS (Fim do ficheiro)
// ==========================================
router.put('/requests/:id', requestController.request_update);
router.delete('/requests/:id', requestController.request_delete);

module.exports = router;