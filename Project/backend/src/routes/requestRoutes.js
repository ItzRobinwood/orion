const express = require("express");
const router = express.Router();

const requestController = require("../controllers/requestController");

// Rotas de leitura (GET)
router.get('/requests', requestController.request_list);
router.get('/requests/:id', requestController.request_detail);

// 🟢 Rotas de criação (POST) - Ambas apontam para o mesmo controlador corrigido!
router.post('/requests/create', requestController.request_create); // Rota antiga/padrão
router.post('/requests', requestController.request_create);        // Rota de emergência para o React

// Rotas de modificação e remoção (PUT / DELETE)
router.put('/requests/:id', requestController.request_update);
router.delete('/requests/:id', requestController.request_delete);
router.put('/requests/:id/close', requestController.request_close);

module.exports = router;
