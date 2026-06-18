// ✅ Modelos importados diretamente dos ficheiros individuais
const Request = require('../models/requestModel');
const RequestType = require('../models/requestTypeModel');
const User = require('../models/User');
const RequestFile = require('../models/requestFilesModel'); 

// ==========================================
// 1. LISTAR TODOS OS PEDIDOS (GET /api/requests)
// ==========================================
const request_list = async (req, res) => {
    try {
        const requests = await Request.findAll({
            include: [
                { model: RequestType },
                { model: User, as: 'creator' },
                { model: User, as: 'assignedTo' }
            ],
            order: [['createdAt', 'DESC']] 
        });

        const mappedRequests = requests.map(r => {
            let statusReact = "Pendente";
            if (r.status === "in_progress") statusReact = "Em Execução";
            if (r.status === "closed") statusReact = "Concluídos";

            return {
                id: r.id,
                type: r.RequestType ? r.RequestType.name : "Geral",
                type_name: r.RequestType ? r.RequestType.name : "Geral",
                date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("pt-PT") : "",
                status: statusReact, 
                notes: r.description,
                assignedToId: r.assignedTo ? r.assignedTo.id_Utilizador : "", 
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
// 2. ATRIBUIR GESTOR (PUT /api/requests/:id/assign) - CORRIGIDO 🚀
// ==========================================
const assign_manager = async (req, res) => {
    try {
        const { id } = req.params; 
        const { managerId } = req.body; 

        const request = await Request.findByPk(id);
        if (!request) {
            return res.status(404).json({ success: false, message: "Pedido não encontrado." });
        }

        // 🟢 CORREÇÃO: Atualiza o campo exato mapeado no teu requestModel.js
        request.assignedToId = managerId ? Number(managerId) : null; 
        
        if (managerId) {
            request.status = "in_progress";
        } else {
            request.status = "open"; 
        }

        await request.save();

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
// 3. DETALHAR UM PEDIDO POR ID (GET /api/requests/:id)
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
// 4. CRIAR NOVO PEDIDO (POST /api/requests)
// ==========================================
const request_create = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'O servidor não conseguiu ler os dados do formulário (req.body está vazio).'
            });
        }

        const {
            requestTypeId, type,
            creatorId,
            assignedToId,
            subject,
            description, notes,
            subtype
        } = req.body;

        const finalRequestTypeId = requestTypeId || type;
        const finalDescription = description || notes;
        const finalSubject = subject || "Pedido via Portal";

        if (!finalRequestTypeId || !finalDescription) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor, selecione o tipo de pedido e preencha a descrição.' 
            });
        }

        const requestType = await RequestType.findByPk(finalRequestTypeId);
        if (!requestType) {
            return res.status(404).json({ 
                success: false, 
                message: 'O tipo de pedido selecionado é inválido.' 
            });
        }

        const newRequest = await Request.create({
            requestTypeId: Number(finalRequestTypeId),
            creatorId: creatorId ? Number(creatorId) : 1, 
            assignedToId: assignedToId || null, 
            subject: finalSubject,
            description: finalDescription,
            subtype: requestType.name === 'Others' && subtype ? subtype.trim() : null, 
            status: 'open'
        });

        if (req.file) {
            await RequestFile.create({
                requestId: newRequest.id,
                fileName: req.file.originalname,
                filePath: req.file.path,
                uploadedAt: new Date()
            });
        }

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
// 5. LISTAR FICHEIROS DISPONÍVEIS (GET /api/requests/files)
// ==========================================
const request_files_list = async (req, res) => {
    try {
        const files = await RequestFile.findAll({
            order: [['uploadedAt', 'DESC']]
        });
        return res.json(files);
    } catch (error) {
        console.error("Erro ao listar ficheiros:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 6. DESCARREGAR FICHEIRO POR ID (GET /api/requests/files/download/:id)
// ==========================================
const request_file_download = async (req, res) => {
    try {
        const { id } = req.params;
        const fileRecord = await RequestFile.findByPk(id);

        if (!fileRecord) {
            return res.status(404).json({ success: false, message: "Ficheiro não encontrado." });
        }

        return res.download(fileRecord.filePath, fileRecord.fileName);
    } catch (error) {
        console.error("Erro no download:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 7. ATUALIZAR PEDIDO (PUT /api/requests/:id)
// ==========================================
const request_update = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findByPk(id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        await request.update(req.body);
        return res.json({ success: true, message: 'Pedido atualizado.', request });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 8. ELIMINAR PEDIDO (DELETE /api/requests/:id)
// ==========================================
const request_delete = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findByPk(id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        await request.destroy();
        return res.json({ success: true, message: 'Pedido eliminado.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 9. FECHAR PEDIDO (PUT /api/requests/:id/close)
// ==========================================
const request_close = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findByPk(id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        await request.update({ status: 'closed' });
        return res.json({ success: true, message: 'Pedido fechado.', request });
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
    request_delete,
    request_close,
    assign_manager
};