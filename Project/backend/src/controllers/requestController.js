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

// ==========================================
// 3. CRIAR NOVO PEDIDO (POST)
// ==========================================
const request_create = async (req, res) => {
    try {
        const {
            requestTypeId,
            creatorId,
            assignedToId,
            subject,
            description,
            subtype
        } = req.body;

        if (!requestTypeId || !creatorId || !subject || !description) {
            return res.status(400).json({ success: false, message: 'Campos obrigatórios em falta.' });
        }

        const requestType = await RequestType.findByPk(requestTypeId);

        if (!requestType) {
            return res.status(404).json({ success: false, message: 'Tipo de pedido não encontrado.' });
        }

        // Validação do subtype para pedidos do tipo "Others"
        if (requestType.name === 'Others' && (!subtype || subtype.trim() === '')) {
            return res.status(400).json({ success: false, message: 'Subtype é obrigatório para pedidos do tipo Others.' });
        }

        const newRequest = await Request.create({
            requestTypeId,
            creatorId,
            assignedToId: assignedToId || null,
            subject,
            description,
            subtype: requestType.name === 'Others' ? subtype.trim() : null,
            status: 'open',
            openedAt: new Date()
        });

        return res.status(201).json({
            success: true,
            message: 'Pedido criado com sucesso.',
            request: newRequest
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
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
