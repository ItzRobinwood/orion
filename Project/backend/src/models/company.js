const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    // Responsável de Segurança
    nomeResponsavelSeg: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emailResponsavelSeg: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    telefoneResponsavelSeg: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Contacto Permanente
    nomeContactoPerm: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emailContactoPerm: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    telefoneContactoPerm: {
        type: DataTypes.STRING,
        allowNull: true
    },

    status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
}

}, {
    tableName: 'companies',
    timestamps: false
});

module.exports = Company;