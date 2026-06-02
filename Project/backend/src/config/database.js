const { Pool } = require("pg");

// Validação amigável para os teus colegas de equipa se esquecerem da variável localmente
if (!process.env.DATABASE_URL) {
    console.error("❌ ERRO: A variável de ambiente DATABASE_URL não foi definida!");
    console.error("Lembra-te de passá-la no terminal antes de iniciar o servidor.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false 
    }
});

pool.on("connect", () => {
    console.log(" Ligado com sucesso à base de dados Neon!");
});

module.exports = pool;