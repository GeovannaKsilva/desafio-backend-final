const mysql = require('mysql2');

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'desafio_backend',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  dateStrings: true
};

// Criar pool de conexões
const pool = mysql.createPool(dbConfig);

// Promisificar o pool para usar async/await
const promisePool = pool.promise();

// Testar conexão
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Conectado ao banco de dados MySQL');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
    return false;
  }
};

// Executar teste de conexão
testConnection();

module.exports = {
  pool: promisePool,
  testConnection
};