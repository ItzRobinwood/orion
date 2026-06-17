const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Incident = sequelize.define('Incident', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    impact: { type: DataTypes.ENUM('Baixo', 'Médio', 'Alto', 'Crítico'), allowNull: true },
    systems: { type: DataTypes.STRING, allowNull: true },
    actions: { type: DataTypes.TEXT, allowNull: true },
    creatorId: { type: DataTypes.INTEGER, allowNull: true }
}, {
    tableName: 'incidents',
    timestamps: true
});

module.exports = Incident;
