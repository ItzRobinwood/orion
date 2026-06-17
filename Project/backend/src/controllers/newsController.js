const News = require('../models/newsmodel');

exports.getNews = async (req, res) => {
  try {
    const noticias = await News.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(noticias);
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    res.status(500).json({ message: "Erro interno ao carregar notícias." });
  }
};