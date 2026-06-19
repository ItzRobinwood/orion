const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Content = sequelize.define('Content', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    page: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    section: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    updated: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    tableName: 'Content',
    timestamps: false
});

module.exports = Content;