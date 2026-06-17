const Question = require('../models/questions');
const MessageQuestion = require('../models/messagesQuestions');
const User = require('../models/User');

exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll({
            include: [{
                model: MessageQuestion,
                as: 'messages',
                attributes: ['text', 'createdAt'],
                include: [{ model: User, as: 'sender', attributes: ['name'] }]
            }],
            order: [['createdAt', 'DESC']]
        });

        const mappedQuestions = questions.map(q => {
            const lastReply = q.messages?.length > 0 ? q.messages[q.messages.length - 1] : null;
            return {
                id: q.id,
                subject: q.subject,
                message: q.description || "",
                date: q.createdAt ? new Date(q.createdAt).toLocaleDateString("pt-PT") : "",
                status: q.messages?.length > 0 ? "Respondido" : "Pendente",
                reply: lastReply ? `${lastReply.sender?.name}: ${lastReply.text}` : ""
            };
        });

        return res.json({ success: true, questions: mappedQuestions });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const { subject, message, creatorId } = req.body;
        if (!subject || !message) {
            return res.status(400).json({ success: false, message: "Assunto e mensagem são obrigatórios." });
        }

        const newQuestion = await Question.create({
            subject,
            description: message,
            creatorId: creatorId || null
        });

        return res.status(201).json({
            success: true,
            message: "Questão enviada com sucesso!",
            question: newQuestion
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
