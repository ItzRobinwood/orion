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
    { page: 'Setores', section: 'Setor publica Descrição', content: 'Entidades governamentais e serviços públicos. Garantimos a integridade dos dados dos cidadãos e a resiliência das infraestruturas críticas do Estado.' },

    { page: 'Setores', section: 'Setor industria Título', content: 'INDÚSTRIA' },
    { page: 'Setores', section: 'Setor industria Descrição', content: 'Manufatura e processos industriais. Protegemos sistemas OT/Sistemas de Controlo Industrial contra interrupções operacionais e espionagem económica.' },

    { page: 'Setores', section: 'Setor energia Título', content: 'ENERGIA' },
    { page: 'Setores', section: 'Setor energia Descrição', content: 'Produção e distribuição de energia. Blindamos redes inteligentes e sistemas de distribuição para assegurar o fornecimento contínuo e sem falhas.' },

    { page: 'Setores', section: 'Setor saude Título', content: 'SAÚDE' },
    { page: 'Setores', section: 'Setor saude Descrição', content: 'Hospitais, clínicas e serviços de saúde. Garantimos a proteção dos dados sensíveis e a resiliência dos sistemas de informação médica.' },

    { page: 'Setores', section: 'Setor transporte Título', content: 'TRANSPORTE' },
    { page: 'Setores', section: 'Setor transporte Descrição', content: 'Logística e infraestrutura de transporte. Garantimos a segurança das operações de transporte e a proteção dos dados relacionados.' },

    { page: 'Setores', section: 'Setor tecnologia Título', content: 'EMPRESAS TECNOLÓGICAS' },
    { page: 'Setores', section: 'Setor tecnologia Descrição', content: 'Software, SaaS e serviços digitais. Protegemos as soluções tecnológicas contra ameaças cibernéticas e garantimos a continuidade dos serviços.' },

    { page: 'Setores', section: 'CTA Título', content: 'PRONTO PARA PROTEGER O SEU SETOR?' },
    { page: 'Setores', section: 'CTA Texto', content: 'Fale com a nossa equipa de engenharia de segurança. Analisamos os riscos específicos da sua infraestrutura e desenhamos uma estratégia de defesa à medida da sua organização. ' },
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
