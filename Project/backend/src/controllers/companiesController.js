const Company = require('../models/company');
const User = require('../models/User');

// GET ALL
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

// CREATE
exports.createCompany = async (req, res) => {
    try {
        const {
            nome, status,
            nomeResponsavelSeg, emailResponsavelSeg, telefoneResponsavelSeg,
            nomeContactoPerm, emailContactoPerm, telefoneContactoPerm
        } = req.body;

        if (!nome) return res.status(400).json({ success: false, message: 'Nome é obrigatório.' });

        const company = await Company.create({
            nome, status: status !== false,
            nomeResponsavelSeg, emailResponsavelSeg, telefoneResponsavelSeg,
            nomeContactoPerm, emailContactoPerm, telefoneContactoPerm
        });

        return res.status(201).json({ success: true, company });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE
exports.updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(id);
        if (!company) return res.status(404).json({ success: false, message: 'Empresa não encontrada.' });

        await company.update(req.body);
        return res.json({ success: true, company });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE
exports.deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(id);
        if (!company) return res.status(404).json({ success: false, message: 'Empresa não encontrada.' });

        await company.destroy();
        return res.json({ success: true, message: 'Empresa eliminada com sucesso.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};