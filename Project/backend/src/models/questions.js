const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
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
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'open'
    },
    openedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    closedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    assignedToId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'questions',
    timestamps: false
});

module.exports = Question;