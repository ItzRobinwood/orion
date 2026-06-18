// ✅ Modelos importados diretamente dos ficheiros individuais
const Request = require('../models/requestModel');
const RequestType = require('../models/requestTypeModel');
const User = require('../models/User');

/// ==========================================
// 1. LISTAR TODOS OS PEDIDOS (GET /api/requests) - ATUALIZADO
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

        const mappedRequests = requests.map(r => {
            // Alinhado com o teu frontend: 'open' -> Pendente, 'in_progress' -> Em Execução, 'closed' -> Concluídos
            let statusReact = "Pendente";
            if (r.status === "in_progress") statusReact = "Em Execução";
            if (r.status === "closed") statusReact = "Concluídos";

            return {
                id: r.id,
                type: r.RequestType ? r.RequestType.name : "Geral",
                type_name: r.RequestType ? r.RequestType.name : "Geral",
                date: r.openedAt ? new Date(r.openedAt).toLocaleDateString("pt-PT") : "",
                status: statusReact, 
                notes: r.description,
                
                // 🟢 ADICIONA ESTES DOIS CAMPOS AQUI PARA O FRONTEND CONSEGUIR LER!
                assignedToId: r.assignedTo ? r.assignedTo.id : "", 
                assignedToName: r.assignedTo ? (r.assignedTo.name || r.assignedTo.nome) : "Sem atribuição"
            };
        });

        return res.json({
            success: true,
            requests: mappedRequests
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. NOVA ROTA: ATRIBUIR GESTOR (PUT /api/requests/:id/assign)
// ==========================================
const assign_manager = async (req, res) => {
    try {
        const { id } = req.params; 
        const { managerId } = req.body; 

        const request = await Request.findByPk(id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Pedido não encontrado." });
        }

        // ⚠️ Nota: Confirma se na tua BD a coluna se chama 'id_assignedTo' ou 'assignedToId'
        request.id_assignedTo = managerId || null; 
        
        // Se um administrador atribui um gestor, o estado passa automaticamente para em execução
        if (managerId) {
            request.status = "in_progress";
        } else {
            request.status = "open"; 
        }

        await request.save();

        return res.json({ 
            success: true, 
            message: "Gestor atribuído com sucesso!" 
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// ==========================================
// 2. DETALHAR UM PEDIDO POR ID (GET /api/requests/:id)
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

// ==========================================
// 3. CRIAR NOVO PEDIDO (POST /api/requests/create ou /api/requests)
// ==========================================
const request_create = async (req, res) => {
    try {
        // Extrai tanto os campos originais do backend como os campos que o React envia
        const {
            requestTypeId, type,       // Aceita 'requestTypeId' ou 'type'
            creatorId,
            assignedToId,
            subject,
            description, notes,        // Aceita 'description' ou 'notes'
            subtype
        } = req.body;

        // Mapeamento inteligente: se vier do React, usa as variáveis dele
        const finalRequestTypeId = requestTypeId || type;
        const finalDescription = description || notes;
        const finalSubject = subject || "Pedido via Portal";

        // Validação de campos obrigatórios
        if (!finalRequestTypeId || !finalDescription) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor, selecione o tipo de pedido e preencha a descrição.' 
            });
        }

        // Verificar se o tipo de pedido existe na Base de Dados
        const requestType = await RequestType.findByPk(finalRequestTypeId);
        if (!requestType) {
            return res.status(404).json({ 
                success: false, 
                message: 'O tipo de pedido selecionado é inválido.' 
            });
        }

        // Validação inteligente para o tipo "Others"
        if (requestType.name === 'Others' && (!subtype || subtype.trim() === '')) {
            return res.status(400).json({ 
                success: false, 
                message: 'É obrigatório especificar o subtipo quando escolhe a opção "Outros".' 
            });
        }

        // Criar o registo na Base de Dados com o Sequelize
        const newRequest = await Request.create({
            requestTypeId: Number(finalRequestTypeId),
            creatorId: creatorId || 1, // Fallback caso o frontend não passe o ID do user logado
            assignedToId: assignedToId || null, 
            subject: finalSubject,
            description: finalDescription,
            subtype: requestType.name === 'Others' ? subtype.trim() : null, 
            status: 'open', 
            openedAt: new Date() 
        });

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

// ==========================================
// 4. ATUALIZAR PEDIDO (PUT /api/requests/:id)
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
// 5. ELIMINAR PEDIDO (DELETE /api/requests/:id)
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
// 6. FECHAR PEDIDO (PUT /api/requests/:id/close)
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

// Exportação unificada de todas as funções do controlador
module.exports = {
    request_list,
    request_detail,
    request_create,
    request_update,
    request_delete,
    request_close,
    assign_manager
};
