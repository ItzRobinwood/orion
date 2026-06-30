const express = require('express');
const router = express.Router();
const controller = require('../controllers/companiesController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/companies', verifyToken, verifyAdmin, controller.getCompanies);
router.post('/companies', verifyToken, verifyAdmin, controller.createCompany);
router.put('/companies/:id', verifyToken, verifyAdmin, controller.updateCompany);
router.delete('/companies/:id', verifyToken, verifyAdmin, controller.deleteCompany);

module.exports = router;