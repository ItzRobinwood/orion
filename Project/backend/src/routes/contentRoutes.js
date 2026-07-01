const express = require('express');
const router = express.Router();
const Content = require('../models/contentModel');

// GET /api/content
router.get('/content', async (req, res) => {
    try {
        const content = await Content.findAll({ order: [['id', 'ASC']] });
        res.json(content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/content/:id
router.put('/content/:id', async (req, res) => {
    try {
        const { content } = req.body;
        const updated = new Date().toLocaleDateString('pt-PT');
        await Content.update(
            { content, updated },
            { where: { id: req.params.id } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

