// ✅ Correção: Importando os modelos diretamente dos seus ficheiros individuais
const Request = require('../models/requestModel');
const RequestType = require('../models/requestTypeModel');
const User = require('../models/User');


// GET ALL REQUESTS
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

        // 🟢 ALTERADO: Retorna no formato de objeto esperado pelo React
        return res.json({
            success: true,
            requests: requests
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//
// GET REQUEST BY ID
//
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
            return res.status(404).json({ message: 'Request not found' });
        }

        return res.json(request);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//
// CREATE REQUEST
//
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
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // ✅ Validação do subtype para pedidos do tipo "Others"
        const requestType = await RequestType.findByPk(requestTypeId);

        if (!requestType) {
            return res.status(404).json({ message: 'Request type not found' });
        }

        if (requestType.name === 'Others' && (!subtype || subtype.trim() === '')) {
            return res.status(400).json({ message: 'Subtype é obrigatório para pedidos do tipo Others' });
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

        return res.status(201).json(newRequest);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//
// UPDATE REQUEST
//
const request_update = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findByPk(id, {
            include: [{ model: RequestType }]
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // ✅ Validação do subtype caso o requestTypeId seja alterado ou já seja "Others"
        const newRequestTypeId = req.body.requestTypeId || request.requestTypeId;
        const requestType = await RequestType.findByPk(newRequestTypeId);

        if (requestType.name === 'Others') {
            const newSubtype = req.body.subtype || request.subtype;
            if (!newSubtype || newSubtype.trim() === '') {
                return res.status(400).json({ message: 'Subtype é obrigatório para pedidos do tipo Others' });
            }
            req.body.subtype = newSubtype.trim();
        } else {
            // Se mudou de Others para outro tipo, limpa o subtype
            req.body.subtype = null;
        }

        await request.update(req.body);

        return res.json({
            message: 'Request updated successfully',
            request
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//
// DELETE REQUEST
//
const request_delete = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findByPk(id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await request.destroy();

        return res.json({ message: 'Request deleted successfully' });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//
// CLOSE REQUEST
//
const request_close = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findByPk(id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await request.update({
            status: 'closed',
            closedAt: new Date()
        });

        return res.json({
            message: 'Request closed successfully',
            request
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//
// EXPORT
//
module.exports = {
    request_list,
    request_detail,
    request_create,
    request_update,
    request_delete,
    request_close
};