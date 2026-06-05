const express = require('express');
const router = express.Router();
const controller = require('../controllers/companiesController');

router.get('/companies', controller.getCompanies);
router.post('/companies', controller.createCompany);
router.put('/companies/:id', controller.updateCompany);
router.delete('/companies/:id', controller.deleteCompany);

module.exports = router;