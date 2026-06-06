const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Request = sequelize.define('Request', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    subject: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    status: {
        type: DataTypes.ENUM('open', 'in_progress', 'closed'),
        defaultValue: 'open',
        allowNull: false
    },

    subtype: {
        type: DataTypes.STRING,
        allowNull: true
    },

    openedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    closedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    tableName: 'requests',
    timestamps: false
});

module.exports = Request;