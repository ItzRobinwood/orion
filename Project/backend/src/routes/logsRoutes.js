const express = require('express');
const router = express.Router();
const { getLogs, getStats } = require('../controllers/logsController');

router.get('/logs', getLogs);
router.get('/stats', getStats);

module.exports = router;