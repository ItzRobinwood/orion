// Script pontual para adicionar as entradas de conteúdo das restantes páginas
// (NIS2, Serviços, Metodologia, Início, Notícias, Contactos) à tabela Content,
// sem tocar no que já lá está (usa findOrCreate, é seguro correr mais do que uma vez).
// Correr uma vez com: node src/seeders/addRemainingContent.js

require('dotenv').config();
const Content = require('../models/contentModel');
require('../config/database');

const entries = [
    // ---------- NIS2 ----------
    { page: 'NIS2', section: 'Hero Badge', content: 'LEGISLAÇÃO EUROPEIA' },
    { page: 'NIS2', section: 'Hero Título', content: 'Diretiva NIS2 em Portugal' },
    { page: 'NIS2', section: 'Hero Subtítulo', content: 'A Diretiva NIS2 foi transposta para a legislação portuguesa através do Decreto-Lei n.º 125/2025' },

    { page: 'NIS2', section: 'O Que É Título', content: 'O QUE É A DIRETIVA NIS2' },
    { page: 'NIS2', section: 'O Que É Texto', content: 'A Diretiva NIS2 (Network and Information Security Directive 2) é legislação europeia destinada a reforçar a cibersegurança e a resiliência digital das organizações que prestam serviços essenciais ou importantes para a sociedade e economia.' },

    { page: 'NIS2', section: 'Ameaça ransomware', content: 'Ataques de ransomware' },
    { page: 'NIS2', section: 'Ameaça vulnerabilidades', content: 'Exploração de vulnerabilidades em infraestruturas críticas' },
    { page: 'NIS2', section: 'Ameaça espionagem', content: 'Espionagem digital' },
    { page: 'NIS2', section: 'Ameaça cadeia', content: 'Ataques a serviços públicos e cadeias de abastecimento' },

    { page: 'NIS2', section: 'Vigência Label', content: 'Em vigor na União Europeia desde 2023' },
    { page: 'NIS2', section: 'Vigência Valor', content: 'Transposta para Portugal através do Decreto-Lei n.º 125/2025' },

    { page: 'NIS2', section: 'Quem Se Aplica Título', content: 'A QUEM SE APLICA' },
    { page: 'NIS2', section: 'Quem Se Aplica Texto', content: 'A NIS2 aplica-se a Entidades Essenciais e Entidades Importantes:' },

    { page: 'NIS2', section: 'Setor energia', content: 'Energia' },
    { page: 'NIS2', section: 'Setor transportes', content: 'Transportes' },
    { page: 'NIS2', section: 'Setor saude', content: 'Saúde' },
    { page: 'NIS2', section: 'Setor agua', content: 'Água potável e saneamento' },
    { page: 'NIS2', section: 'Setor digital', content: 'Infraestruturas digitais' },
    { page: 'NIS2', section: 'Setor publica', content: 'Administração pública' },

    { page: 'NIS2', section: 'Critérios Texto', content: 'Critérios gerais: Organizações com mais de 50 colaboradores ou com volume de negócios superior a 10 milhões de euros.' },
    { page: 'NIS2', section: 'Autoridade Texto', content: 'Em Portugal, a autoridade responsável é o Centro Nacional de Cibersegurança (CNCS).' },

    { page: 'NIS2', section: 'Sanções Título', content: 'SANÇÕES POR INCUMPRIMENTO' },
    { page: 'NIS2', section: 'Sanções Subtítulo', content: 'As penalizações por não conformidade são significativas' },

    { page: 'NIS2', section: 'Sanções essenciais Título', content: 'ENTIDADES ESSENCIAIS' },
    { page: 'NIS2', section: 'Sanções essenciais multa', content: 'Até €10 milhões ou 2% do volume de negócios' },
    { page: 'NIS2', section: 'Sanções essenciais auditorias', content: 'Auditorias obrigatórias' },
    { page: 'NIS2', section: 'Sanções essenciais ordens', content: 'Ordens de implementação de medidas' },

    { page: 'NIS2', section: 'Sanções importantes Título', content: 'ENTIDADES IMPORTANTES' },
    { page: 'NIS2', section: 'Sanções importantes multa', content: 'Até €7 milhões ou 1.4% do volume de negócios' },
    { page: 'NIS2', section: 'Sanções importantes supervisao', content: 'Supervisão regulatória' },
    { page: 'NIS2', section: 'Sanções importantes responsabilizacao', content: 'Responsabilização da gestão executiva' },

    { page: 'NIS2', section: 'CTA Sanções Botão', content: 'AVALIE A SUA CONFORMIDADE NIS2 →' },

    { page: 'NIS2', section: 'Como Ajudamos Título', content: 'COMO AJUDAMOS NA CONFORMIDADE NIS2' },
    { page: 'NIS2', section: 'Ajuda enquadramento Título', content: 'ANÁLISE DE ENQUADRAMENTO' },
    { page: 'NIS2', section: 'Ajuda enquadramento Descrição', content: 'Determinamos se a sua entidade está abrangida pela NIS2' },
    { page: 'NIS2', section: 'Ajuda maturidade Título', content: 'AVALIAÇÃO DE MATURIDADE' },
    { page: 'NIS2', section: 'Ajuda maturidade Descrição', content: 'Análise do nível atual de cibersegurança' },
    { page: 'NIS2', section: 'Ajuda risco Título', content: 'GESTÃO DE RISCO' },
    { page: 'NIS2', section: 'Ajuda risco Descrição', content: 'Implementação de framework de análise de risco' },
    { page: 'NIS2', section: 'Ajuda politicas Título', content: 'POLÍTICAS E PROCEDIMENTOS' },
    { page: 'NIS2', section: 'Ajuda politicas Descrição', content: 'Desenvolvimento de documentação necessária' },
    { page: 'NIS2', section: 'Ajuda controlos Título', content: 'CONTROLOS TÉCNICOS' },
    { page: 'NIS2', section: 'Ajuda controlos Descrição', content: 'Implementação de medidas de segurança adequadas' },
    { page: 'NIS2', section: 'Ajuda incidentes Título', content: 'GESTÃO DE INCIDENTES' },
    { page: 'NIS2', section: 'Ajuda incidentes Descrição', content: 'Apoio à comunicação e resposta a incidentes' },

    // ---------- Serviços ----------
    { page: 'Serviços', section: 'Hero Badge', content: 'SOLUÇÕES EMPRESARIAIS' },
    { page: 'Serviços', section: 'Hero Título', content: 'Os Nossos Serviços' },
    { page: 'Serviços', section: 'Hero Subtítulo', content: 'Oferecemos uma gama completa de serviços de cibersegurança adaptados às necessidades da sua organização.' },

    { page: 'Serviços', section: 'Serviço nis2 Badge', content: 'DESTAQUE' },
    { page: 'Serviços', section: 'Serviço nis2 Título', content: 'IMPLEMENTAÇÃO DA DIRETIVA NIS2' },
    { page: 'Serviços', section: 'Serviço nis2 Descrição', content: 'Ajudamos a sua organização a alinhar-se com os requisitos da diretiva europeia NIS2 através de uma abordagem estruturada.' },
    { page: 'Serviços', section: 'Serviço nis2 enquadramento', content: 'Análise de enquadramento da entidade' },
    { page: 'Serviços', section: 'Serviço nis2 maturidade', content: 'Avaliação de maturidade de cibersegurança' },
    { page: 'Serviços', section: 'Serviço nis2 risco', content: 'Análise e gestão de risco' },
    { page: 'Serviços', section: 'Serviço nis2 politicas', content: 'Definição de políticas e procedimentos' },
    { page: 'Serviços', section: 'Serviço nis2 controlos', content: 'Implementação de controlos técnicos' },
    { page: 'Serviços', section: 'Serviço nis2 incidentes', content: 'Apoio à gestão de incidentes' },

    { page: 'Serviços', section: 'Serviço auditorias Título', content: 'AUDITORIAS DE CIBERSEGURANÇA' },
    { page: 'Serviços', section: 'Serviço auditorias Descrição', content: 'As auditorias permitem avaliar o nível real de segurança da organização.' },
    { page: 'Serviços', section: 'Serviço auditorias configuracao', content: 'Auditorias de configuração de sistemas' },
    { page: 'Serviços', section: 'Serviço auditorias vulnerabilidades', content: 'Análise de vulnerabilidades' },
    { page: 'Serviços', section: 'Serviço auditorias arquitetura', content: 'Revisão da arquitetura de segurança' },
    { page: 'Serviços', section: 'Serviço auditorias acessos', content: 'Avaliação de controlos de acesso' },
    { page: 'Serviços', section: 'Serviço auditorias politicasaudit', content: 'Auditoria a políticas e procedimentos' },

    { page: 'Serviços', section: 'Serviço formacao Título', content: 'FORMAÇÃO E AWARENESS' },
    { page: 'Serviços', section: 'Serviço formacao Descrição', content: 'Uma parte significativa dos incidentes de segurança começa com erro humano. Os programas de awareness ajudam a reduzir este risco.' },
    { page: 'Serviços', section: 'Serviço formacao colaboradores', content: 'Formação em cibersegurança para colaboradores' },
    { page: 'Serviços', section: 'Serviço formacao phishing', content: 'Campanhas de phishing simulado' },
    { page: 'Serviços', section: 'Serviço formacao workshops', content: 'Workshops para equipas técnicas' },
    { page: 'Serviços', section: 'Serviço formacao gestao', content: 'Sessões para equipas de gestão' },

    { page: 'Serviços', section: 'Crítico Título', content: 'PORQUE A CIBERSEGURANÇA É CRÍTICA' },
    { page: 'Serviços', section: 'Crítico Texto', content: 'Hoje em dia quase todas as organizações dependem de sistemas digitais para funcionar. Um incidente de segurança pode causar interrupção de serviços, perda de dados, impacto financeiro e danos reputacionais. A cibersegurança é hoje uma questão de continuidade do negócio.' },

    // ---------- Metodologia ----------
    { page: 'Metodologia', section: 'Hero Badge', content: 'ABORDAGEM TÉCNICA' },
    { page: 'Metodologia', section: 'Hero Título', content: 'A Nossa Metodologia' },
    { page: 'Metodologia', section: 'Hero Subtítulo', content: 'Frameworks e normas internacionais que guiam o nosso trabalho' },

    { page: 'Metodologia', section: 'Framework iso27001 Título', content: 'ISO/IEC 27001' },
    { page: 'Metodologia', section: 'Framework iso27001 Descrição', content: 'Norma internacional para a gestão de privacidade e proteção de dados' },
    { page: 'Metodologia', section: 'Framework nist Título', content: 'NIST FRAMEWORK' },
    { page: 'Metodologia', section: 'Framework nist Descrição', content: 'Framework criada pelo Instituto Nacional de Padrões e Tecnologia (NIST) para ajudar organizações a gerir e mitigar riscos cibernéticos ' },
    { page: 'Metodologia', section: 'Framework cis Título', content: 'CIS CONTROLS' },
    { page: 'Metodologia', section: 'Framework cis Descrição', content: 'Conjunto de boas práticas de cibersegurança, geridas pelo Center for Internet Security (CIS)' },
    { page: 'Metodologia', section: 'Framework enisa Título', content: 'ENISA GUIDELINES' },
    { page: 'Metodologia', section: 'Framework enisa Descrição', content: 'Enquadramento de diretrizes, relatórios técnicos e boas práticas que visam alcançar um elevado nível comum de cibersegurança em toda a Europa.' },

    { page: 'Metodologia', section: 'CTA Título', content: 'QUER SABER MAIS SOBRE A NOSSA ABORDAGEM?' },
    { page: 'Metodologia', section: 'CTA Texto', content: 'Fale com especialistas e entenda como aplicar estas frameworks internacionais para blindar a sua infraestrutura e garantir a continuidade do seu negócio.' },
    { page: 'Metodologia', section: 'CTA Botão', content: 'SOLICITAR CONSULTA COM UM ESPECIALISTA →' },

    // ---------- Início: Hero ----------
    { page: 'Início', section: 'Hero Título', content: 'Cibersegurança para organizações' },
    { page: 'Início', section: 'Hero Texto', content: 'Num contexto em que os ataques cibernéticos aumentam todos os dias, as organizações precisam de proteger os seus sistemas, dados e serviços críticos. Apoiamos empresas e entidades públicas na redução do risco cibernético, no cumprimento de requisitos regulatórios, incluindo a Diretiva Europeia NIS2, e no reforço da sua postura de segurança.' },
    { page: 'Início', section: 'Hero Botão', content: 'Contactar' },

    // ---------- Início: Context ----------
    { page: 'Início', section: 'Contexto Badge', content: 'PANORAMA ATUAL' },
    { page: 'Início', section: 'Contexto Título', content: 'O Contexto Atual' },
    { page: 'Início', section: 'Contexto Subtítulo', content: 'A cibersegurança tornou-se uma prioridade estratégica para organizações públicas e privadas. Proteger os ativos de informação consiste num pilar fundamental para a continuidade e reputação de qualquer negócio. A sofisticação crescente das ameaças cibernéticas exige uma postura proativa, onde a mitigação de riscos e a resiliência operacional determinam o sucesso e a confiança no mercado.' },

    { page: 'Início', section: 'Ameaça ransomware Título', content: 'ATAQUES DE RANSOMWARE' },
    { page: 'Início', section: 'Ameaça ransomware Descrição', content: 'Crescimento exponencial de ataques que encriptam dados e exigem resgates' },
    { page: 'Início', section: 'Ameaça vulnerabilidades Título', content: 'EXPLORAÇÃO DE VULNERABILIDADES' },
    { page: 'Início', section: 'Ameaça vulnerabilidades Descrição', content: 'Aproveitamento de falhas de segurança em sistemas e aplicações' },
    { page: 'Início', section: 'Ameaça infraestruturas Título', content: 'ATAQUES A INFRAESTRUTURAS' },
    { page: 'Início', section: 'Ameaça infraestruturas Descrição', content: 'Alvos estratégicos como energia, água e transportes sob ameaça constante' },
    { page: 'Início', section: 'Ameaça phishing Título', content: 'PHISHING DIRECIONADO' },
    { page: 'Início', section: 'Ameaça phishing Descrição', content: 'Ataques sofisticados que exploram o fator humano' },

    { page: 'Início', section: 'Contexto Info', content: 'Muitas organizações descobrem tarde demais que não estavam preparadas para um incidente de segurança.' },
    { page: 'Início', section: 'Contexto Destaque', content: 'A PREVENÇÃO É MAIS EFICAZ QUE A REMEDIAÇÃO' },

    // ---------- Início: About ----------
    // Nota: as chaves "Missão" / "Visão" / "Valores" (texto do corpo dos cards) não estão
    // aqui porque já usavam getContent antes desta ronda de alterações — devem já existir
    // na tabela. Se ainda não existirem, terás de as criar manualmente com o texto real
    // no painel de CMS (o fallback no código está vazio "").
    { page: 'Início', section: 'Sobre Badge', content: 'QUEM SOMOS' },
    { page: 'Início', section: 'Sobre Título', content: 'Sobre a CyberBox Security' },
    { page: 'Início', section: 'Sobre Subtítulo', content: 'Somos uma equipa de especialistas em cibersegurança dedicados a proteger organizações públicas e privadas. Combinamos conhecimento técnico avançado, monitorização proativa e as melhores práticas internacionais para mitigar riscos, blindar infraestruturas críticas e garantir a continuidade do seu negócio face às ameaças cibernéticas mais complexas.' },
    { page: 'Início', section: 'Sobre Missão Título', content: 'MISSÃO: Proteger empresas e organizações contra ameaças cibernéticas através de soluções inovadoras, monitorização contínua e expertise especializada.' },
    { page: 'Início', section: 'Sobre Visão Título', content: 'VISÃO: Ser a referência nacional em cibersegurança, reconhecidos pela excelência técnica, inovação e compromisso com a segurança dos nossos clientes.' },
    { page: 'Início', section: 'Sobre Valores Título', content: 'VALORES: Integridade, excelência técnica, inovação contínua e compromisso total com a proteção dos dados e sistemas dos nossos clientes.' },

    // ---------- Notícias ----------
    { page: 'Notícias', section: 'Hero Badge', content: 'CIBERSEGURANÇA' },
    { page: 'Notícias', section: 'Hero Título', content: 'Últimas Notícias' },
    { page: 'Notícias', section: 'Hero Subtítulo', content: 'Mantenha-se atualizado com as últimas notícias em cibersegurança' },
    { page: 'Notícias', section: 'Card Link Texto', content: 'Ler mais →' },
    { page: 'Notícias', section: 'Erro Texto', content: 'Não foi possível carregar as notícias. Tenta novamente.' },
    { page: 'Notícias', section: 'Botão A Carregar', content: '⏳ A carregar...' },
    { page: 'Notícias', section: 'Botão Atualizar', content: '🔄 Atualizar' },
    { page: 'Notícias', section: 'Última Atualização Label', content: 'Última atualização:' },

    // ---------- Contactos ----------
    { page: 'Contactos', section: 'Hero Badge', content: 'CONTACTO' },
    { page: 'Contactos', section: 'Hero Título', content: 'Fale Connosco' },
    { page: 'Contactos', section: 'Hero Subtítulo', content: 'A nossa equipa está pronta para ajudar a proteger a sua organização' },

    { page: 'Contactos', section: 'Info email Título', content: 'EMAIL' },
    { page: 'Contactos', section: 'Info email Valor', content: 'geral@orion.pt' },
    { page: 'Contactos', section: 'Info telefone Título', content: 'TELEFONE' },
    { page: 'Contactos', section: 'Info telefone Valor', content: '+351 000 000 000' },
    { page: 'Contactos', section: 'Info localizacao Título', content: 'LOCALIZAÇÃO' },
    { page: 'Contactos', section: 'Info localizacao Valor', content: 'Viseu, Portugal' },
    { page: 'Contactos', section: 'Info horario Título', content: 'HORÁRIO' },
    { page: 'Contactos', section: 'Info horario Valor', content: 'Seg–Sex, 9h–18h' },

    { page: 'Contactos', section: 'Formulário Título', content: 'ENVIAR MENSAGEM' },
    { page: 'Contactos', section: 'Sucesso Título', content: 'Mensagem enviada!' },
    { page: 'Contactos', section: 'Sucesso Texto', content: 'Entraremos em contacto brevemente.' },

    { page: 'Contactos', section: 'Campo Nome Label', content: 'Nome *' },
    { page: 'Contactos', section: 'Campo Nome Placeholder', content: 'O seu nome' },
    { page: 'Contactos', section: 'Campo Email Label', content: 'Email *' },
    { page: 'Contactos', section: 'Campo Email Placeholder', content: 'email@empresa.pt' },
    { page: 'Contactos', section: 'Campo Empresa Label', content: 'Empresa' },
    { page: 'Contactos', section: 'Campo Empresa Placeholder', content: 'Nome da empresa' },
    { page: 'Contactos', section: 'Campo Assunto Label', content: 'Assunto' },
    { page: 'Contactos', section: 'Campo Assunto Placeholder', content: 'Ex: Avaliação NIS2' },
    { page: 'Contactos', section: 'Campo Mensagem Label', content: 'Mensagem *' },
    { page: 'Contactos', section: 'Campo Mensagem Placeholder', content: 'Descreva como podemos ajudar...' },

    { page: 'Contactos', section: 'Alerta Obrigatórios', content: 'Preenche os campos obrigatórios.' },
    { page: 'Contactos', section: 'Botão A Enviar', content: 'A enviar...' },
    { page: 'Contactos', section: 'Botão Enviar', content: 'ENVIAR MENSAGEM →' },
];

const run = async () => {
    const updated = new Date().toLocaleDateString('pt-PT');
    for (const entry of entries) {
        await Content.findOrCreate({
            where: { page: entry.page, section: entry.section },
            defaults: { ...entry, updated }
        });
    }
    console.log(`✅ ${entries.length} entradas verificadas/criadas para NIS2, Serviços, Metodologia, Início, Notícias e Contactos.`);
    process.exit(0);
};

run().catch((err) => {
    console.error('Erro ao adicionar conteúdo:', err);
    process.exit(1);
});