const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta o caminho para onde tens a tua config do Sequelize

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
    // Transforma a string "Segurança,Malware" num array ['Segurança', 'Malware'] ao ler da BD
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? rawValue.split(',') : [];
    },
    // Transforma o array do JavaScript numa string antes de salvar na BD
    set(val) {
      this.setDataValue('tags', Array.isArray(val) ? val.join(',') : val);
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'news',
  timestamps: true // Cria automaticamente os campos createdAt e updatedAt
});

module.exports = News;