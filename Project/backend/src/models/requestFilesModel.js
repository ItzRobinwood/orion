const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RequestFile = sequelize.define('RequestFile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // 🟢 COLUNA EM FALTA ADICIONADA: Sem isto, as associações quebram o backend!
    requestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'requests', // Nome da tabela de pedidos na BD
            key: 'id'
        }
    },
    uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'RequestFiles', // 🟢 Garante que o Sequelize bate na tabela com "s" no fim
    timestamps: false          // Mantém desativado os createdAt/updatedAt fantasmas
});

module.exports = RequestFile;