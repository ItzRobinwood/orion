const Logs = require('../models/logs');
const User = require('../models/User');

// Função utilitária para criar logs (usada noutros controllers)
const createLog = async ({ action, entity, details, ip, userId }) => {
    try {
        await Logs.create({
            action,
            entity,
            details: details || null,
            date_time: new Date(),
            ip: ip || "0.0.0.0",
            userId: userId || null
        });
    } catch (err) {
        console.error("Erro ao criar log:", err.message);
    }
};

// GET /api/logs — listar logs para o dashboard
const getLogs = async (req, res) => {
    try {
        const logs = await Logs.findAll({
            include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
            order: [['date_time', 'DESC']],
            limit: 50
        });

        const mapped = logs.map(l => ({
            id: l.id_log,
            action: l.action,
            entity: l.entity,
            details: l.details,
            date: new Date(l.date_time).toLocaleDateString("pt-PT"),
            time: new Date(l.date_time).toLocaleTimeString("pt-PT"),
            ip: l.ip,
            user: l.user?.name || "Sistema"
        }));

        return res.json({ success: true, logs: mapped });
    } catch (error) {
        console.error("Erro em getLogs:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/stats — contadores para os cards do dashboard
const getStats = async (req, res) => {
    try {
        const User = require('../models/User');
        const Question = require('../models/questions');
        const Request = require('../models/requestModel');

        const [users, tickets, requests] = await Promise.all([
            User.count(),
            Question.count(),
            Request.count()
        ]);

        return res.json({ success: true, stats: { users, tickets, requests } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createLog, getLogs, getStats };