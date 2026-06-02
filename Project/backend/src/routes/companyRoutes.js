const express = require("express");
const router = express.Router();
const controller = require("../controllers/companyController");

// Criar empresa
router.post("/companies", controller.createCompany);

// Listar empresas
router.get("/companies", controller.getCompanies);

module.exports = router;