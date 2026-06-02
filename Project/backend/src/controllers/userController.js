const User = require("../models/User");
const bcrypt = require("bcryptjs");

// CRIAR UTILIZADOR
exports.createUser = async (req, res) => {
    try {
        // 🟢 CORREÇÃO: Adicionado 'telephone' e 'status' que vêm do React
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

        // 🟢 CORREÇÃO: Se o admin enviar "Inativo", grava false. Caso contrário, grava true.
        const isWithActiveStatus = status === "Inativo" ? false : true;

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            id_tipo,
            id_empresa,
            telephone, // 🟢 Guardar o telefone na BD
            active: isWithActiveStatus,
        });

        return res.status(201).json({
            success: true,
            message: "Utilizador criado com sucesso.",
            user: {
                id: newUser.id_Utilizador || newUser.id, // Evita problemas caso o nome da PK varie no modelo
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
            return res.status(400).json({
                success: false,
                message: "Email e palavra-passe são obrigatórios.",
            });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Credenciais inválidas.",
            });
        }

        if (!user.active) {
            return res.status(403).json({
                success: false,
                message: "A sua conta ainda não foi ativada. Contacte o administrador.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Credenciais inválidas.",
            });
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
        return res.status(500).json({
            success: false,
            message: error.message,
        });
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