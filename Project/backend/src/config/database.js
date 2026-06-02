const { Sequelize } = require("sequelize");

// Validação amigável para os teus colegas de equipa localmente
if (!process.env.DATABASE_URL) {
    console.error("❌ ERRO: A variável de ambiente DATABASE_URL não foi definida!");
    console.error("Lembra-te de passá-la no terminal antes de iniciar o servidor.");
}

// Criar a instância correta do Sequelize que os teus modelos exigem
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false, // Evita encher os logs do Render com texto de queries SQL puras
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Obrigatório para a ligação segura com o Neon
        }
    }
});

// Testar a ligação (Equivalente ao pool.on("connect"))
sequelize.authenticate()
    .then(() => {
        console.log("🚀 Ligado com sucesso à base de dados Neon através do Sequelize!");
    })
    .catch(err => {
        console.error("❌ Erro ao autenticar a ligação à base de dados:", err.message);
    });

// Exporta a instância minúscula 'sequelize' que tem a função '.define'
module.exports = sequelize;