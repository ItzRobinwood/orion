const express = require('express');
const router = express.Router();
const { getLogs, getStats, getLogsByUser } = require('../controllers/logsController');

router.get('/logs', getLogs);
router.get('/logs/user/:userID', getLogsByUser); // logs de um utilizador específico
router.get('/stats', getStats);

module.exports = router;