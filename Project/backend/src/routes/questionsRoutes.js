const express = require('express');
const router = express.Router();
const controller = require('../controllers/questionsController');

router.get('/questions', controller.getQuestions);
router.post('/questions', controller.createQuestion);
router.post('/questions/:id/reply', controller.replyQuestion);
router.put('/questions/:id/close', controller.closeQuestion);
router.get('/questions/:id/messages', controller.getMessages);
router.put('/questions/:id/assign', controller.assignQuestion);

module.exports = router;