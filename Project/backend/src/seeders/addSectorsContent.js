// Script pontual para adicionar as entradas de "Setores" à tabela Content
// sem tocar no que já lá está (usa findOrCreate, é seguro correr mais do que uma vez).
// Correr uma vez com: node src/seeders/addSectorsContent.js

require('dotenv').config();
const Content = require('../models/contentModel');
require('../config/database');

const entries = [
    { page: 'Setores', section: 'Hero Título', content: 'Setores que Servimos' },
    { page: 'Setores', section: 'Hero Subtítulo', content: 'Experiência especializada nas indústrias mais críticas e reguladas' },

    { page: 'Setores', section: 'Setor publica Título', content: 'ADMINISTRAÇÃO PÚBLICA' },
    { page: 'Setores', section: 'Setor publica Descrição', content: 'Entidades governamentais e serviços públicos' },

    { page: 'Setores', section: 'Setor industria Título', content: 'INDÚSTRIA' },
    { page: 'Setores', section: 'Setor industria Descrição', content: 'Manufatura e processos industriais' },

    { page: 'Setores', section: 'Setor energia Título', content: 'ENERGIA' },
    { page: 'Setores', section: 'Setor energia Descrição', content: 'Produção e distribuição de energia' },

    { page: 'Setores', section: 'Setor saude Título', content: 'SAÚDE' },
    { page: 'Setores', section: 'Setor saude Descrição', content: 'Hospitais, clínicas e serviços de saúde' },

    { page: 'Setores', section: 'Setor transporte Título', content: 'TRANSPORTE' },
    { page: 'Setores', section: 'Setor transporte Descrição', content: 'Logística e infraestrutura de transporte' },

    { page: 'Setores', section: 'Setor tecnologia Título', content: 'EMPRESAS TECNOLÓGICAS' },
    { page: 'Setores', section: 'Setor tecnologia Descrição', content: 'Software, SaaS e serviços digitais' },

    { page: 'Setores', section: 'CTA Título', content: 'PRONTO PARA PROTEGER O SEU SETOR?' },
    { page: 'Setores', section: 'CTA Texto', content: 'Fale connosco e descubra como podemos ajudar a sua organização.' },
];

const run = async () => {
    const updated = new Date().toLocaleDateString('pt-PT');
    for (const entry of entries) {
        await Content.findOrCreate({
            where: { page: entry.page, section: entry.section },
            defaults: { ...entry, updated }
        });
    }
    console.log(`✅ ${entries.length} entradas de "Setores" verificadas/criadas.`);
    process.exit(0);
};

run().catch((err) => {
    console.error('Erro ao adicionar conteúdo:', err);
    process.exit(1);
});
