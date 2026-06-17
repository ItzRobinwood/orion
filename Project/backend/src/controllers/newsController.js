const News = require('../models/newsModel');

exports.getNews = async (req, res) => {
  try {
    // Procura todas as notícias na BD ordenadas pela data de criação decrescente
    const noticias = await News.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    // Envia o Array diretamente para o React
    res.status(200).json(noticias);
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    res.status(500).json({ message: "Erro interno ao carregar notícias." });
  }
};