const Question = require('../models/questions');
const MessageQuestion = require('../models/messagesQuestions');
const User = require('../models/User');

exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll({
            include: [
                {
                    model: MessageQuestion,
                    as: 'messages',
                    include: [{ model: User, as: 'sender', attributes: ['name'] }],
                    order: [['sentAt', 'ASC']] 
                },
                { model: User, as: 'creator', attributes: ['name', 'email'] },
                { model: User, as: 'assignedTo', attributes: ['name'] }
            ],
            order: [['openedAt', 'DESC']]
        });

        const mappedQuestions = questions.map(q => {
            const lastReply = q.messages?.length > 0
                ? q.messages[q.messages.length - 1]
                : null;

            return {
                id: q.id,
                subject: q.subject,
                date: q.openedAt
                    ? new Date(q.openedAt).toLocaleDateString("pt-PT")
                    : "",
                status: q.messages?.length > 0 ? "Respondido" : "Pendente",
                createdBy: q.creator?.name || "Cliente",
                assignedTo: q.assignedTo?.name || "Sem atribuição",
                messagesCount: q.messages?.length || 0,
                lastReply: lastReply
                    ? `${lastReply.sender?.name || "?"}: ${lastReply.message}`
                    : "Sem resposta"
            };
        });

        return res.json({ success: true, questions: mappedQuestions });
    } catch (error) {
        console.error("Erro em getQuestions:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const { subject, creatorId } = req.body;

        if (!subject) {
            return res.status(400).json({ success: false, message: "Assunto é obrigatório." });
        }

        const newQuestion = await Question.create({
            subject,
            creatorId: creatorId || null,
            status: 'open',
            openedAt: new Date()
        });

        return res.status(201).json({
            success: true,
            message: "Questão criada com sucesso!",
            question: newQuestion
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.replyQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, userId } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Mensagem é obrigatória." });
        }

        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({ success: false, message: "Questão não encontrada." });
        }

        const newMessage = await MessageQuestion.create({
            questionId: id,
            userId: userId || null,
            message,
            sentAt: new Date(),
            read: false
        });

        return res.status(201).json({
            success: true,
            message: "Resposta enviada!",
            reply: newMessage
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.closeQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findByPk(id);
        if (!question) {
            return res.status(404).json({ success: false, message: "Questão não encontrada." });
        }

        await question.update({ status: 'closed', closedAt: new Date() });

        return res.json({ success: true, message: "Questão fechada com sucesso!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await MessageQuestion.findAll({
            where: { questionId: id },
            include: [{ model: User, as: 'sender', attributes: ['name'] }],
            order: [['sentAt', 'ASC']]
        });
        return res.json({ success: true, messages });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};