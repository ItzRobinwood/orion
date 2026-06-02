const User = require("../models/User");
const bcrypt = require("bcryptjs");

// CRIAR UTILIZADOR
exports.createUser = async (req, res) => {
    try {
        // Captura o telephone e tenta capturar o status (caso ele envie no futuro)
        const { name, email, password, id_tipo, id_empresa, telephone, status } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Campos obrigatórios em falta." });
        }

        // ... lógica de verificação de email existente e bcrypt ...

        // Blindagem: Se o front não mandar status, assume true (Ativo) por padrão
        const isWithActiveStatus = status === "Inativo" ? false : true;

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            id_tipo,
            id_empresa: id_empresa || null, // Se o admin não tiver empresa associada, grava nulo
            telephone, 
            active: isWithActiveStatus,
        });

        // 🟢 SOLUÇÃO CRUCIAL: Devolve TANTO 'id' como 'id_Utilizador' para que o React dele 
        // e os teus modelos da BD funcionem em simultâneo sem dar undefined!
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
        return res.status(500).json({ success: false, message: error.message });
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