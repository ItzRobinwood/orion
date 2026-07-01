const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { createLog } = require('./logsController');

// CRIAR UTILIZADOR
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, id_tipo, id_empresa, telephone, status } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Nome, email e palavra-passe são obrigatórios.",
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Já existe um utilizador com este email.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const isWithActiveStatus = status === "Inativo" ? false : true;

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            id_tipo,
            id_empresa: id_empresa || null,
            telephone,
            active: isWithActiveStatus,
        });

        await createLog({
            action: "CREATE",
            entity: "User",
            details: `Novo utilizador criado: ${newUser.email}`,
            ip: req.ip,
            userId: newUser.id_Utilizador
        });

        return res.status(201).json({
            success: true,
            message: "Utilizador criado com sucesso.",
            user: {
                id: newUser.id_Utilizador || newUser.id,
                id_Utilizador: newUser.id_Utilizador || newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// LOGIN
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email e palavra-passe são obrigatórios." });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ success: false, message: "Credenciais inválidas." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Credenciais inválidas." });
        }

        await createLog({
            action: "LOGIN",
            entity: "User",
            details: `Login efetuado por ${user.email}`,
            ip: req.ip,
            userId: user.id_Utilizador
        });

        // 🟢 GERAR O TOKEN
        const token = jwt.sign(
            { id: user.id_Utilizador, id_tipo: user.id_tipo },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.json({
            success: true,
            message: "Login efetuado com sucesso.",
            token,
            user: {
                id: user.id_Utilizador || user.id,
                name: user.name,
                email: user.email,
                id_tipo: user.id_tipo,
                id_empresa: user.id_empresa,
            },
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ATUALIZAR UTILIZADOR
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, telephone, status, password, newPassword, id_empresa } = req.body;

        const user = await User.findOne({ where: { id_Utilizador: id } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilizador não encontrado.",
            });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (telephone) updateData.telephone = telephone;
        if (status) updateData.active = (status !== "Inativo");

        if (id_empresa !== undefined) {
            updateData.id_empresa = id_empresa ? parseInt(id_empresa) : null;
        }

        if (password && newPassword) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "A palavra-passe atual está incorreta.",
                });
            }
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        await User.update(updateData, { where: { id_Utilizador: id } });

        return res.json({
            success: true,
            message: "Utilizador atualizado com sucesso.",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// LISTAR TODOS OS UTILIZADORES
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id_Utilizador', 'name', 'email', 'telephone', 'active', 'id_tipo', 'id_empresa']
        });

        return res.json({
            success: true,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ where: { id_Utilizador: id } });

        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado." });
        }

        await user.destroy();

        return res.json({ success: true, message: "Utilizador eliminado com sucesso." });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findOne({ where: { id_Utilizador: id } });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado." });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "A palavra-passe atual está incorreta." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { id_Utilizador: id } });

        return res.json({ success: true, message: "Palavra-passe alterada com sucesso." });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// LISTAR SÓ CLIENTES (para manager)
exports.getClients = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { id_tipo: 3 },
            attributes: ['id_Utilizador', 'name', 'email', 'telephone', 'active', 'id_tipo', 'id_empresa']
        });
        return res.json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// DADOS DO UTILIZADOR LOGADO (para Settings)
exports.getMe = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id_Utilizador: req.user.id },
            attributes: ['id_Utilizador', 'name', 'email', 'telephone', 'id_tipo', 'id_empresa']
        });
        if (!user) return res.status(404).json({ success: false, message: "Utilizador não encontrado." });
        return res.json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};