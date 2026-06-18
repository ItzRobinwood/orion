const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Importa a instância do Sequelize e conecta ao banco de dados, SEMPRE copiar e colar isto

const User = sequelize.define("User", {
  id_Utilizador: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

    name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },

  Date_created: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },

  id_tipo: {
  type: DataTypes.INTEGER,
  allowNull: false,
},

id_empresa: {
  type: DataTypes.INTEGER,
  allowNull: true, // true para permitir que Admins fiquem sem empresa
}

}, {
    timestamps: false
},
);

module.exports = User;