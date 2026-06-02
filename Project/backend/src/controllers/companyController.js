const Company = require("../models/company");

// Criar uma nova empresa
exports.createCompany = async (req, res) => {
    try {
        const { company, status, clients, securityManager, permanentContact } = req.body;

        // Cria a empresa no banco de dados do Neon
        const novaEmpresa = await Company.create({
            company,
            status: status || "Ativo",
            // Nota: Se a tua tabela "Company" tiver colunas separadas para clients, 
            // securityManager, etc. (ou guardadas como JSON), passa-as aqui.
            clients: JSON.stringify(clients), 
            securityManager: JSON.stringify(securityManager),
            permanentContact: JSON.stringify(permanentContact)
        });

        res.status(201).json({ success: true, company: novaEmpresa });
    } catch (error) {
        console.error("Erro ao criar empresa:", error);
        res.status(500).json({ success: false, message: "Erro interno ao criar empresa." });
    }
};

// Listar todas as empresas (para o painel carregar ao abrir)
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll();
        
        // Se guardaste como string, fazemos o parse de volta para objeto/array antes de enviar ao React
        const formatadas = companies.map(c => ({
            id: c.id,
            company: c.company,
            status: c.status,
            clients: typeof c.clients === 'string' ? JSON.parse(c.clients) : c.clients,
            securityManager: typeof c.securityManager === 'string' ? JSON.parse(c.securityManager) : c.securityManager,
            permanentContact: typeof c.permanentContact === 'string' ? JSON.parse(c.permanentContact) : c.permanentContact,
        }));

        res.status(200).json(formatadas);
    } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        res.status(500).json({ success: false, message: "Erro ao buscar empresas." });
    }
};