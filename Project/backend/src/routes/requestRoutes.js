const express = require("express");
const router = express.Router();


const requestController = require("../controllers/requestController");

// Garante que o teu routes/requestRoutes.js está assim:
router.get('/requests', requestController.request_list);
router.get('/requests/:id', requestController.request_detail);
router.post('/requests/create', requestController.request_create);
router.put('/requests/:id', requestController.request_update);
router.delete('/requests/:id', requestController.request_delete);
router.put('/requests/:id/close', requestController.request_close);
router.post('/requests/create', requestController.request_create);

module.exports = router;