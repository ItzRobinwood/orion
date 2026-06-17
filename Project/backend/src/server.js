require("dotenv").config();
const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");

// models
require("./models/UserType");
require("./models/User");
require("./models/company");
require("./models/incidentModel");
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
const newsRoutes = require('./routes/newsRoutes');

// associations
const applyAssociations = require("./models/associations");

// seeds
const seedUserTypes = require("./seeders/seedUserTypes");
const seedRequestTypes = require("./seeders/seedRequestTypes");

// services
const cron = require('node-cron');
const { buscarNoticiasOnline } = require('./services/newsScraper');

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", requestRoutes);
app.use("/api", userRoutes);
app.use('/api', companiesRoutes);
app.use('/api', newsRoutes);

app.get("/", (req, res) => {
  res.send("CyberBox API está online e funcional! 🚀");
});

applyAssociations();

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(async () => {
  console.log("Banco sincronizado com sucesso 🚀");

  await seedUserTypes();
  await seedRequestTypes();

  buscarNoticiasOnline();
cron.schedule('0 * * * *', () => {
  buscarNoticiasOnline();
});

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🚀`);
  });
}).catch((err) => {
  console.error("Erro fatal ao conectar à base de dados:", err.message);
  process.exit(1);
});

