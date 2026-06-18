const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta para o teu caminho real

const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    requestTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'requestTypeId' // Garante o camelCase idêntico à base de dados
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'creatorId'
    },
    assignedToId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'assignedToId'
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    subtype: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'open'
    },
    // 🟢 Se a tua tabela no Supabase usa 'createdAt', mapeia assim:
    createdAt: {
        type: DataTypes.DATE,
        field: 'createdAt',
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'requests', // Nome exato da tabela no Supabase (geralmente em minúsculas)
    timestamps: false      // ❌ Bloqueia o Sequelize de procurar a coluna 'updatedAt' que não existe!
});

module.exports = Request;