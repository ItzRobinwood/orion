const express = require("express");
const router = express.Router();
const RequestType = require("../models/requestTypeModel");

router.get("/request-types", async (req, res) => {
    try {
        const types = await RequestType.findAll();
        res.json(types);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar tipos de pedido" });
    }
});

module.exports = router;