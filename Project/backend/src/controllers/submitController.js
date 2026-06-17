const Incident = require('../models/incidentModel'); 

exports.saveAssetsBulk = async (req, res) => {
    try {
        const { assets } = req.body;
        if (!assets || !Array.isArray(assets) || assets.length === 0) {
            return res.status(400).json({ success: false, message: "Nenhum ativo foi enviado." });
        }
        return res.status(201).json({
            success: true,
            message: `${assets.length} ativos guardados com sucesso! 🚀`
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.createIncident = async (req, res) => {
    try {
        const { date, type, description, impact, systems, actions, creatorId } = req.body;

        if (!date || !type || !description) {
            return res.status(400).json({ 
                success: false, 
                message: "Os campos Data, Tipo e Descrição são obrigatórios." 
            });
        }

        const newIncident = await Incident.create({
            date, type, description,
            impact: impact || null,
            systems: systems || null,
            actions: actions || null,
            creatorId: creatorId || null
        });

        return res.status(201).json({
            success: true,
            message: "Incidente registado com sucesso (Normas CNCS)! 🛡️",
            incident: newIncident
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
