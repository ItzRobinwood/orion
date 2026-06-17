const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

        // 1. Primeiro geramos o Hash da password e guardamos na constante
        const hashedPassword = await bcrypt.hash(password, 10);

        // O admin escolhe o estado no React, se for "Inativo" grava false, senão true
        const isWithActiveStatus = status === "Inativo" ? false : true;

        // 2. Agora o 'hashedPassword' já existe e pode ser usado com segurança aqui dentro!
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword, // <--- Aqui ele já vai encontrar a variável!
            id_tipo,
            id_empresa: id_empresa || null,
            telephone, 
            active: isWithActiveStatus,
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

        console.log("📧 Email recebido:", email);
        console.log("🔑 Password recebida:", password);

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email e palavra-passe são obrigatórios." });
        }

        const user = await User.findOne({ where: { email } });
        console.log("👤 Utilizador encontrado:", user ? "SIM" : "NÃO");

        if (!user) {
            return res.status(401).json({ success: false, message: "Credenciais inválidas." });
        }

        console.log("🔐 Active:", user.active);
        console.log("🔐 Password na BD:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("✅ Password correta:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Credenciais inválidas." });
        }

        return res.json({
            success: true,
            message: "Login efetuado com sucesso.",
            user: {
                id: user.id_Utilizador || user.id,
                name: user.name,
                email: user.email,
                id_tipo: user.id_tipo,
                id_empresa: user.id_empresa,
            },
        });

    } catch (error) {
        console.log("❌ ERRO:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ATUALIZAR UTILIZADOR
exports.updateUser = async (req, res) => {
    try {
        // 🟢 CORREÇÃO: Captura o ID a partir dos parâmetros da URL (/api/users/:id)
        const { id } = req.params; 
        const { name, email, telephone, status, password, newPassword } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilizador não encontrado.",
            });
        }

        // Criar o objeto com os dados a atualizar
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (telephone) updateData.telephone = telephone;
        if (status) updateData.active = (status !== "Inativo");

        // 🟢 Se o pedido incluir alteração de password, valida a antiga antes de encriptar a nova
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
            attributes: ['id_Utilizador', 'name', 'email', 'telephone', 'active', 'id_tipo']
            // Buscamos apenas os campos necessários, sem expor a password encriptada por segurança
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

//DELETE USER
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; 
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado." });
        }

        await user.destroy();

        return res.json({ success: true, message: "Utilizador eliminado com sucesso." });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

