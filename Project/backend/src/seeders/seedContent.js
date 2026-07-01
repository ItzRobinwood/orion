const Content = require('../models/contentModel');

const seedContent = async () => {
    const count = await Content.count();
    if (count > 0) return;

    await Content.bulkCreate([
        // Hero
        { page: 'Início', section: 'Hero Título', content: 'Cibersegurança para organizações', updated: '10/05/2026' },
        { page: 'Início', section: 'Hero Texto', content: 'Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos. Apoiamos empresas e entidades públicas na redução do risco cibernético, no cumprimento de requisitos regulatórios, incluindo a Diretiva Europeia NIS2, e no reforço da sua postura de segurança.', updated: '10/05/2026' },
        { page: 'Início', section: 'Hero Botão', content: 'Contactar', updated: '10/05/2026' },

        // About
        { page: 'Início', section: 'Sobre Título', content: 'Sobre a CyberBox Security', updated: '10/05/2026' },
        { page: 'Início', section: 'Sobre Subtítulo', content: 'Somos especialistas em cibersegurança com mais de 15 anos de experiência em proteger organizações contra ameaças digitais.', updated: '10/05/2026' },
        { page: 'Início', section: 'Missão', content: 'Proteger empresas e organizações contra ameaças cibernéticas através de soluções inovadoras, monitorização contínua e expertise especializada.', updated: '10/05/2026' },
        { page: 'Início', section: 'Visão', content: 'Ser a referência nacional em cibersegurança, reconhecidos pela excelência técnica, inovação e compromisso com a segurança dos nossos clientes.', updated: '10/05/2026' },
        { page: 'Início', section: 'Valores', content: 'Integridade, excelência técnica, inovação contínua e compromisso total com a proteção dos dados e sistemas dos nossos clientes.', updated: '10/05/2026' },

        // Context
        { page: 'Início', section: 'Contexto Título', content: 'O Contexto Atual', updated: '10/05/2026' },
        { page: 'Início', section: 'Contexto Subtítulo', content: 'A cibersegurança tornou-se uma prioridade estratégica para organizações públicas e privadas.', updated: '10/05/2026' },
        { page: 'Início', section: 'Contexto Info', content: 'Muitas organizações descobrem tarde demais que não estavam preparadas para um incidente de segurança. Além do impacto operacional, existem hoje obrigações legais e regulatórias que exigem a implementação de medidas adequadas de cibersegurança.', updated: '10/05/2026' },
    ]);
    console.log('✅ Content seeded!');
};

module.exports = seedContent;