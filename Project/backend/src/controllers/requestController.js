// ✅ Modelos importados diretamente dos ficheiros individuais
const Request = require('../models/requestModel');
const RequestType = require('../models/requestTypeModel');
const User = require('../models/User');

// ==========================================
// 1. LISTAR TODOS OS PEDIDOS (GET)
// ==========================================
const request_list = async (req, res) => {
    try {
        const requests = await Request.findAll({
            include: [
                { model: RequestType },
                { model: User, as: 'creator' },
                { model: User, as: 'assignedTo' }
            ],
            order: [['openedAt', 'DESC']]
        });

        return res.json({
            success: true,
            requests: requests
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. DETALHAR UM PEDIDO POR ID (GET)
// ==========================================
const request_detail = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findByPk(id, {
            include: [
                { model: RequestType },
                { model: User, as: 'creator' },
                { model: User, as: 'assignedTo' }
            ]
        });

        if (!request) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        return res.json({
            success: true,
            request: request
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const Request = require('../models/requestModel');
const RequestType = require('../models/requestTypeModel');
const User = require('../models/User');

// ==========================================
// CRIAR NOVO PEDIDO (POST /api/requests/create)
// ==========================================
const request_create = async (req, res) => {
    try {
        // 1. Extrair os dados que o Frontend vai enviar no corpo da requisição (req.body)
        const {
            requestTypeId,
            creatorId,
            assignedToId,
            subject,
            description,
            subtype
        } = req.body;

        // 2. Validação de campos obrigatórios do sistema
        if (!requestTypeId || !creatorId || !subject || !description) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor, preencha todos os campos obrigatórios (Tipo, Criador, Assunto e Descrição).' 
            });
        }

        // 3. Verificar se o tipo de pedido existe na Base de Dados
        const requestType = await RequestType.findByPk(requestTypeId);
        if (!requestType) {
            return res.status(404).json({ 
                success: false, 
                message: 'O tipo de pedido selecionado é inválido.' 
            });
        }

        // 4. Validação inteligente para o tipo "Others"
        // Se for "Others", o campo 'subtype' passa a ser estritamente obrigatório
        if (requestType.name === 'Others' && (!subtype || subtype.trim() === '')) {
            return res.status(400).json({ 
                success: false, 
                message: 'É obrigatório especificar o subtipo quando escolhe a opção "Outros".' 
            });
        }

        // 5. Criar o registo na Base de Dados com o Sequelize
        const newRequest = await Request.create({
            requestTypeId,
            creatorId,
            assignedToId: assignedToId || null, // Se não for atribuído a ninguém, fica Null
            subject,
            description,
            subtype: requestType.name === 'Others' ? subtype.trim() : null, // Limpa o subtipo se não for "Others"
            status: 'open', // Todos os pedidos novos começam abertos
            openedAt: new Date() // Regista a data e hora exata de abertura
        });

        // 6. Resposta padronizada em formato JSON para o Axios
        return res.status(201).json({
            success: true,
            message: 'Pedido criado com sucesso! 🚀',
            request: newRequest
        });

    } catch (error) {
        console.error("Erro ao criar pedido:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Erro interno no servidor ao tentar criar o pedido.',
            error: error.message 
        });
    }
};

// Não se esqueça de exportar a função no final do ficheiro:
module.exports = {
    // ... as suas outras funções (request_list, etc) ...
    request_create
};


// ==========================================
// 4. ATUALIZAR PEDIDO (PUT)
// ==========================================
const request_update = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findByPk(id, {
            include: [{ model: RequestType }]
        });

        if (!request) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        const newRequestTypeId = req.body.requestTypeId || request.requestTypeId;
        const requestType = await RequestType.findByPk(newRequestTypeId);

        if (requestType.name === 'Others') {
            const newSubtype = req.body.subtype || request.subtype;
            if (!newSubtype || newSubtype.trim() === '') {
                return res.status(400).json({ success: false, message: 'Subtype é obrigatório para pedidos do tipo Others.' });
            }
            req.body.subtype = newSubtype.trim();
        } else {
            req.body.subtype = null;
        }

        await request.update(req.body);

        return res.json({
            success: true,
            message: 'Pedido atualizado com sucesso.',
            request
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 5. ELIMINAR PEDIDO (DELETE)
// ==========================================
const request_delete = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findByPk(id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        await request.destroy();

        return res.json({ success: true, message: 'Pedido eliminado com sucesso.' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 6. FECHAR PEDIDO (PUT)
// ==========================================
const request_close = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findByPk(id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        await request.update({
            status: 'closed',
            closedAt: new Date()
        });

        return res.json({
            success: true,
            message: 'Pedido fechado com sucesso.',
            request
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    request_list,
    request_detail,
    request_create,
    request_update,
    request_delete,
    request_close
};
