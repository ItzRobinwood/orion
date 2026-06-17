const News = require('../models/newsmodel');

// ==========================================
// LISTAR TODAS AS NOTÍCIAS (GET)
// ==========================================
exports.getNews = async (req, res) => {
  try {
    const noticias = await News.findAll({
      order: [['createdAt', 'DESC']]
    });

    // 🟢 PADRONIZADO: Retorna com a flag de sucesso e a propriedade nomeada
    return res.status(200).json({
      success: true,
      news: noticias
    });

  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    
    return res.status(500).json({ 
      success: false, 
      message: "Erro interno ao carregar notícias." 
    });
  }
};
