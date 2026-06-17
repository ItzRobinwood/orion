const Company = require('../models/company');
const User = require('../models/User');

// ==========================================
// 1. LISTAR TODAS AS EMPRESAS (GET)
// ==========================================
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll({
            include: [{
                model: User,
                as: 'users',
                attributes: ['id_Utilizador', 'name', 'email', 'telephone', 'id_tipo']
            }]
        });
        return res.json({ success: true, companies });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. CRIAR NOVA EMPRESA (POST)
// ==========================================
exports.createCompany = async (req, res) => {
    try {
        // Extrai a estrutura exata que o formulário do React envia
        const {
            company, 
            status,
            securityManager, 
            permanentContact
        } = req.body;

        // Validação: O frontend envia 'company', mapeamos para 'nome'
        if (!company) {
            return res.status(400).json({ success: false, message: 'Nome é obrigatório.' });
        }

        // Mapeia o estado de texto do frontend para booleano da Base de Dados
        const isWithActiveStatus = status === "Inativo" ? false : true;

        // Cria o registo na Base de Dados acedendo aos subcampos enviados pelo Axios
        const newCompany = await Company.create({
            nome: company, 
            status: isWithActiveStatus,
            
            // Dados do Gestor de Segurança
            nomeResponsavelSeg: securityManager?.name || null,
            emailResponsavelSeg: securityManager?.email || null,
            telefoneResponsavelSeg: securityManager?.phone || null,
            
            // Dados do Contacto Permanente
            nomeContactoPerm: permanentContact?.name || null,
            emailContactoPerm: permanentContact?.email || null,
            telefoneContactoPerm: permanentContact?.phone || null
        });

        return res.status(201).json({ success: true, company: newCompany });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. ATUALIZAR EMPRESA (PUT)
// ==========================================
exports.updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(id);
        
        if (!company) {
            return res.status(404).json({ success: false, message: 'Empresa não encontrada.' });
        }

        const { company: nameField, status, securityManager, permanentContact } = req.body;

        // Cria o objeto apenas com as propriedades que vieram no pedido
        const updateData = {};
        
        if (nameField !== undefined) updateData.nome = nameField;
        if (status !== undefined) updateData.status = (status !== "Inativo");
        
        // Mapeamento seguro para o Gestor de Segurança
        if (securityManager) {
            if (securityManager.name !== undefined) updateData.nomeResponsavelSeg = securityManager.name;
            if (securityManager.email !== undefined) updateData.emailResponsavelSeg = securityManager.email;
            if (securityManager.phone !== undefined) updateData.telefoneResponsavelSeg = securityManager.phone;
        }

        // Mapeamento seguro para o Contacto Permanente
        if (permanentContact) {
            if (permanentContact.name !== undefined) updateData.nomeContactoPerm = permanentContact.name;
            if (permanentContact.email !== undefined) updateData.emailContactoPerm = permanentContact.email;
            if (permanentContact.phone !== undefined) updateData.telefoneContactoPerm = permanentContact.phone;
        }

        // Atualiza a empresa com o objeto tratado
        await company.update(updateData);
        
        return res.json({ success: true, company });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 4. ELIMINAR EMPRESA (DELETE)
// ==========================================
exports.deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(id);
        
        if (!company) {
            return res.status(404).json({ success: false, message: 'Empresa não encontrada.' });
        }

        await company.destroy();
        return res.json({ success: true, message: 'Empresa eliminada com sucesso.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
