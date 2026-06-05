require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");

// models
require("./models/UserType");
require("./models/User");
require("./models/company");
require("./models/logs");
require("./models/requestModel.js");
require("./models/requestTypeModel.js");
require("./models/requestFilesModel.js");
require("./models/questions.js");
require("./models/messagesQuestions.js");
require("./models/requestStatus.js");

// routes
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");
const companiesRoutes = require('./routes/companiesRoutes');

// associations
const applyAssociations = require("./models/associations");

// seeds
const seedUserTypes = require("./seeders/seedUserTypes");
const seedRequestTypes = require("./seeders/seedRequestTypes");

const app = express();

// Configuração do CORS flexível para o grupo
app.use(cors());
app.use(express.json());

// 🟢 CORREÇÃO 1: Adicionado o prefixo /api que o teu React exige
app.use("/api", requestRoutes);
app.use("/api", userRoutes);
app.use('/api', companiesRoutes);

// Rota de teste para ver no browser se o Render está vivo
app.get("/", (req, res) => {
  res.send("CyberBox API está online e funcional! 🚀");
});

applyAssociations();

const PORT = process.env.PORT || 3000;

// 🟢 CORREÇÃO 2: Removido o { alter: true } para evitar crashes no Neon/Render
sequelize.sync().then(async () => {
  console.log("Banco sincronizado com sucesso 🚀");

  // 🟢 AVISO 3: Garante que dentro destes ficheiros de seed tens um 
  // "if (jaExiste) return;" para não duplicar dados a cada restart do Render!
  await seedUserTypes();
  await seedRequestTypes();

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🚀`);
  });
}).catch((err) => {
  console.error("Erro fatal ao conectar à base de dados:", err.message);
  process.exit(1);
});