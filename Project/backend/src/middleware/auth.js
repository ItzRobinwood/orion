const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token em falta." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // fica disponível nas rotas
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token inválido ou expirado." });
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user?.id_tipo !== 1) {
        return res.status(403).json({ error: "Acesso reservado a administradores." });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };