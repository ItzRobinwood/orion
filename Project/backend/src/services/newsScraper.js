const Parser = require('rss-parser');
const News = require('../models/newsmodel');
const parser = new Parser();

const FONTES = [
  {
    url: 'https://thehackernews.com/feeds/posts/default',
    categoria: 'Ameaças',
    autor: 'The Hacker News'
  },
  {
    url: 'https://www.bleepingcomputer.com/feed/',
    categoria: 'Ransomware',
    autor: 'BleepingComputer'
  },
  {
    url: 'https://www.cncs.gov.pt/pt/alertas/feed/',
    categoria: 'Vulnerabilidades',
    autor: 'CNCS Portugal'
  },
  {
    url: 'https://www.welivesecurity.com/feed/',
    categoria: 'Boas práticas',
    autor: 'ESET WeLiveSecurity'
  },
  {
    url: 'https://www.infosecurity-magazine.com/rss/news/',
    categoria: 'Legislação',
    autor: 'InfoSecurity Magazine'
  },
  {
    url: 'https://www.darkreading.com/rss.xml',
    categoria: 'Incidentes',
    autor: 'Dark Reading'
  }
];

const buscarNoticiasOnline = async () => {
  console.log('A iniciar a recolha de notícias automáticas da internet...');

  for (const fonte of FONTES) {
    try {
      const feed = await parser.parseURL(fonte.url);
    
      const itensnoticias = feed.items.slice(0, 5);

      for (const item of itensnoticias) {
        const jaExiste = await News.findOne({ where: { titulo: item.title } });

        if (!jaExiste) {
          await News.create({
            categoria: fonte.categoria,
            data: new Date(item.pubDate).toLocaleDateString('pt-PT'),
            titulo: item.title,
            descricao: item.contentSnippet ? item.contentSnippet.substring(0, 200) + '...' : 'Sem descrição disponível.',
            autor: fonte.autor,
            tags: ['Cyber', 'Auto'],
            url: item.link
          });
          console.log(`Nova notícia guardada: "${item.title}"`);
        }
      }
    } catch (erro) {
      console.error(`Erro ao ler a fonte [${fonte.autor}]:`, erro.message);
    }
  }
  console.log('Processo de recolha terminado.');
};

module.exports = { buscarNoticiasOnline };