// ✅ Modelos importados diretamente dos ficheiros individuais
const Request = require('../models/requestModel');
const RequestType = require('../models/requestTypeModel');
const User = require('../models/User');
const RequestFile = require('../models/requestFilesModel');
const { createLog } = require('./logsController');

// ==========================================
// 1. LISTAR TODOS OS PEDIDOS (GET /api/requests)
// ==========================================
const request_list = async (req, res) => {
    try {
        const requests = await Request.findAll({
            include: [
                { model: RequestType },
                { model: User, as: 'creator', include: [{ model: require('../models/company'), as: 'company' }] },
                { model: User, as: 'assignedTo' }
            ],
            order: [['createdAt', 'DESC']]
        });

        const mappedRequests = requests.map(r => {
            let statusLabel = "Pendente";
            if (r.status === "in_progress") statusLabel = "Em Execução";
            if (r.status === "closed") statusLabel = "Concluído";

            return {
                id: r.id,
                subject: r.subject,
                description: r.description,
                type: r.RequestType ? r.RequestType.name : "Geral",
                type_name: r.RequestType ? r.RequestType.name : "Geral",
                subtype: r.subtype || null,
                date: r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString("pt-PT")
                    : new Date().toLocaleDateString("pt-PT"),
                status: r.status,           // ✅ 'open', 'in_progress', 'closed'
                statusLabel,                // ✅ 'Pendente', 'Em Execução', 'Concluído'
                company: r.creator?.company?.nome || r.creator?.name || "Cliente",
                creator: r.creator ? {
                    id: r.creator.id_Utilizador,
                    name: r.creator.name,
                    email: r.creator.email
                } : null,
                assignedToId: r.assignedTo ? r.assignedTo.id_Utilizador : null,
                assignedTo: r.assignedTo ? (r.assignedTo.name || "Sem nome") : "Sem atribuição",
                assignedToName: r.assignedTo ? (r.assignedTo.name || "Sem nome") : "Sem atribuição"
            };
        });

        return res.json({
            success: true,
            requests: mappedRequests
        });

    } catch (error) {
        console.error("Erro em request_list:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. ATRIBUIR GESTOR
// ==========================================
const assign_manager = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedToId, managerId } = req.body;
        const resolvedId = assignedToId || managerId;

        const request = await Request.findByPk(id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Pedido não encontrado." });
        }

        request.assignedToId = resolvedId ? Number(resolvedId) : null;
        request.status = resolvedId ? "in_progress" : "open";

        await request.save();

        await createLog({
            action: "ASSIGN",
            entity: "Request",
            details: `Pedido #${id} atribuído ao gestor ${resolvedId}`,
            ip: req.ip
        });

        return res.json({
            success: true,
            message: "Gestor atribuído com sucesso!",
            request
        });

    } catch (error) {
        console.error("Erro em assign_manager:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. DETALHAR PEDIDO
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

        return res.json({ success: true, request });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. CRIAR PEDIDO
// ==========================================
const request_create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Body vazio.'
            });
        }

        const {
            requestTypeId,
            creatorId,
            subject,
            description,
            assignedToId,
            subtype
        } = req.body;

        if (!requestTypeId || !description) {
            return res.status(400).json({
                success: false,
                message: 'Tipo e descrição são obrigatórios.'
            });
        }

        const requestType = await RequestType.findByPk(requestTypeId);
        if (!requestType) {
            return res.status(404).json({
                success: false,
                message: 'Tipo inválido.'
            });
        }

        console.log("subject length:", (subject || "Pedido").length);
        console.log("description length:", description?.length);

        const newRequest = await Request.create({
            requestTypeId: Number(requestTypeId),
            creatorId: creatorId ? Number(creatorId) : 1,
            assignedToId: assignedToId || null,
            subject: subject || "Pedido",
            description,
            subtype: subtype || null,
            status: 'open'
        });

        // 📌 ficheiro opcional
        if (req.file) {
            const base64 = req.file.buffer.toString('base64');

            await RequestFile.create({
                requestId: newRequest.id,
                fileName: req.file.originalname,
                filePath: base64,
                uploadedAt: new Date()
            });
        }

        await createLog({
            action: "CREATE",
            entity: "Request",
            details: `Novo pedido criado: ${newRequest.subject}`,
            ip: req.ip,
            userId: creatorId || null
        });

        return res.status(201).json({
            success: true,
            message: 'Pedido criado!',
            request: newRequest
        });

    } catch (error) {
        console.error("Erro ao criar pedido:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==========================================
// 5. LISTAR FICHEIROS
// ==========================================
const request_files_list = async (req, res) => {
    try {
        const files = await RequestFile.findAll({
            order: [['uploadedAt', 'DESC']]
        });

        return res.json(files);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 6. DOWNLOAD FICHEIRO
// ==========================================
const request_file_download = async (req, res) => {
    try {
        const { id } = req.params;

        const fileRecord = await RequestFile.findByPk(id);

        if (!fileRecord) {
            return res.status(404).json({ success: false, message: "Ficheiro não encontrado." });
        }

        const buffer = Buffer.from(fileRecord.filePath, 'base64');

        res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.fileName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        return res.send(buffer);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 7. UPDATE
// ==========================================
const request_update = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Não encontrado.' });
        }

        await request.update(req.body);

        return res.json({ success: true, request });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 8. DELETE
// ==========================================
const request_delete = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Não encontrado.' });
        }

        await request.destroy();

        return res.json({ success: true });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 9. CLOSE
// ==========================================
const request_close = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Não encontrado.' });
        }

        await request.update({ status: 'closed' });

        return res.json({ success: true, request });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 10. UPDATE STATUS (usado pelo manager)
// ==========================================
const request_update_status = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['open', 'in_progress', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Estado inválido.' });
        }

        const request = await Request.findByPk(id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        await request.update({ status });

        await createLog({
            action: "UPDATE",
            entity: "Request",
            details: `Pedido #${id} atualizado para estado: ${status}`,
            ip: req.ip
        });

        return res.json({ success: true, request });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    request_list,
    request_detail,
    request_create,
    request_files_list,
    request_file_download,
    request_update,
    request_update_status,
    request_delete,
    request_close,
    assign_manager
};