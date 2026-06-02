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

// associations
const applyAssociations = require("./models/associations");

// seeds
const seedUserTypes = require("./seeders/seedUserTypes");
const seedRequestTypes = require("./seeders/seedRequestTypes");

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/", requestRoutes);
app.use("/", userRoutes);

applyAssociations();

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(async () => {
  console.log("Banco sincronizado 🚀");

  await seedUserTypes();
  await seedRequestTypes();

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🚀`);
  });
}).catch((err) => {
  console.error("Erro ao conectar à base de dados:", err.message);
  process.exit(1);
});