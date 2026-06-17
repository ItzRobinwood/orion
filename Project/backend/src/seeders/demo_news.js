'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('news', [
      {
        categoria: 'Ransomware',
        data: '17/06/2026',
        titulo: 'Ataque direcionado a Infraestruturas Críticas',
        descricao: 'Sistemas foram comprometidos na madrugada desta quarta-feira. Equipas de resposta rápida já estão no terreno.',
        autor: 'Nuno Silva',
        tags: 'Ransomware,Ciberataque,Urgente',
        url: 'https://exemplo.com/noticia-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        categoria: 'Boas práticas',
        data: '16/06/2026',
        titulo: 'Guia Prático: Como detetar e-mails de Phishing',
        descricao: 'Aprenda a analisar os cabeçalhos e links falsificados antes de clicar em qualquer anexo suspeito.',
        autor: 'Cláudia Rocha',
        tags: 'Phishing,Dicas,Segurança',
        url: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('news', null, {});
  }
};