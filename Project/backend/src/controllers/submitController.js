const Request = require('../models/requestModel');
const RequestType = require('../models/requestTypeModel');

// ==========================================
// REDIRECIONAR INCIDENTE CNCS PARA A TABELA REQUESTS (POST /api/incidents)
// ==========================================
exports.createIncident = async (req, res) => {
    try {
        const { date, type, description, impact, systems, actions, creatorId } = req.body;

        // 1. Validação dos campos vindos do formulário do frontend
        if (!date || !type || !description) {
            return res.status(400).json({ 
                success: false, 
                message: "Os campos Data, Tipo e Descrição são obrigatórios." 
            });
        }

        // 2. Procurar na tabela de RequestTypes se existe um tipo chamado "Incidente" ou "Others"
        let requestType = await RequestType.findOne({ where: { name: 'Others' } });
        // Se tiver um tipo chamado 'Incidente' na BD, mude a linha acima para { name: 'Incidente' }

        // 3. Montar uma descrição detalhada em texto limpo para guardar na coluna 'description' do Request
        const descricaoFormatada = `
[INCIDENTE RESTRITO CNCS]
• Data do Incidente: ${date}
• Sistemas Afetados: ${systems || 'Não especificado'}
• Impacto Estimado: ${impact || 'Não especificado'}

• Descrição Detalhada: 
${description}

• Ações Tomadas Imediatamente:
${actions || 'Nenhuma ação registada'}
        `.trim();

        // 4. Criar o registo diretamente na tabela 'requests'
        const newRequest = await Request.create({
            requestTypeId: requestType ? requestType.id : 1, // Usa o ID do tipo encontrado ou 1
            creatorId: creatorId || 1,
            assignedToId: null,
            subject: `Incidente CNCS: ${type}`, // O assunto passa a ser o tipo de incidente
            description: descricaoFormatada,    // Guarda o relatório estruturado aqui
            subtype: type,                      // Guarda o tipo de incidente no subtipo
            status: 'open',
            openedAt: new Date()
        });

        // 5. Retorna o sucesso que o frontend espera para poder limpar o ecrã
        return res.status(201).json({
            success: true,
            message: "Incidente registado com sucesso na tabela de Pedidos! 🛡️",
            request: newRequest
        });

    } catch (error) {
        console.error("Erro ao desviar incidente para requests:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
