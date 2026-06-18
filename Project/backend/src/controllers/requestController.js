// ✅ Modelos importados diretamente dos ficheiros individuais
const Request = require('../models/requestModel');
const RequestType = require('../models/requestTypeModel');
const User = require('../models/User');
const RequestFile = require('../models/requestFilesModel'); // 🟢 Importado para gerir os ficheiros

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
            // 🟢 CORREÇÃO: Mudado de 'openedAt' para 'createdAt' conforme o padrão da base de dados
            order: [['createdAt', 'DESC']] 
        });

        const mappedRequests = requests.map(r => {
            let statusReact = "Pendente";
            if (r.status === "in_progress") statusReact = "Em análise";
            if (r.status === "closed") statusReact = "Aprovado";

            return {
                id: r.id,
                type: r.RequestType ? r.RequestType.name : "Geral",
                type_name: r.RequestType ? r.RequestType.name : "Geral",
                // 🟢 CORREÇÃO: Mudado para 'createdAt'
                date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("pt-PT") : "",
                status: statusReact,
                notes: r.description 
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
// 3. CRIAR NOVO PEDIDO (POST /api/requests)
// ==========================================
const request_create = async (req, res) => {
    try {
        // 🟢 SEGURANÇA: Se o req.body vier vazio por falha de middleware, responde sem crashar
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'O servidor não conseguiu ler os dados do formulário (req.body está vazio). Garante que o Multer está ativo na rota.'
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

        // Cria o pedido na Base de Dados
        const newRequest = await Request.create({
            requestTypeId: Number(finalRequestTypeId),
            creatorId: creatorId ? Number(creatorId) : 1, 
            assignedToId: assignedToId || null, 
            subject: finalSubject,
            description: finalDescription,
            subtype: requestType.name === 'Others' && subtype ? subtype.trim() : null, 
            status: 'open'
        });

        // Se o Multer intercetou um ficheiro, regista-o na tabela RequestFiles
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
// 4. LISTAR FICHEIROS DISPONÍVEIS (GET /api/requests/files)
// ==========================================
const request_files_list = async (req, res) => {
    try {
        // 🟢 CORREÇÃO: Mudado de 'createdAt' para 'uploadedAt' (o nome real da coluna na BD)
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
// 5. DESCARREGAR FICHEIRO POR ID (GET /api/requests/files/download/:id)
// ==========================================
const request_file_download = async (req, res) => {
    try {
        const { id } = req.params;
        const fileRecord = await RequestFile.findByPk(id);

        if (!fileRecord) {
            return res.status(404).json({ success: false, message: "Ficheiro não encontrado." });
        }

        // Envia o arquivo físico salvo no servidor de volta ao cliente
        return res.download(fileRecord.filePath, fileRecord.fileName);
    } catch (error) {
        console.error("Erro no download:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 6. ATUALIZAR PEDIDO (PUT /api/requests/:id)
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
// 7. ELIMINAR PEDIDO (DELETE /api/requests/:id)
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
// 8. FECHAR PEDIDO (PUT /api/requests/:id/close)
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
    request_files_list,      // 🟢 Adicionado aos exports
    request_file_download,    // 🟢 Adicionado aos exports
    request_update,
    request_delete,
    request_close
};