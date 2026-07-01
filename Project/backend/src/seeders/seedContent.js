const Content = require('../models/contentModel');

const seedContent = async () => {
    const count = await Content.count();
    if (count > 0) return;

    await Content.bulkCreate([
        { page: 'Início',   section: 'Hero',      content: 'Segurança cibernética para empresas modernas.',          updated: '10/05/2026' },
        { page: 'Home',     section: 'Sobre nós', content: 'A CyberBox protege empresas desde 2018...',              updated: '08/05/2026' },
        { page: 'Serviços', section: 'Intro',     content: 'Oferecemos soluções completas de cibersegurança.',       updated: '02/05/2026' },
        { page: 'NIS2',     section: 'Descrição', content: 'A diretiva NIS2 entra em vigor em 2024...',              updated: '28/04/2026' },
        { page: 'Contacto', section: 'Texto',     content: 'Entre em contacto connosco para mais informações.',      updated: '20/04/2026' },
    ]);
    console.log(' Content seeded!');
};

module.exports = seedContent;


server.js

require("./models/contentModel");

const contentRoutes = require("./routes/contentRoutes");

const seedContent = require("./seeders/seedContent");

app.use('/api', contentRoutes);

  await seedContent();
