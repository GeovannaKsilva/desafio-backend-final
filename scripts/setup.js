require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🔧 Configurando banco de dados...');
  
  try {
    // Conectar ao MySQL sem especificar banco
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    console.log('✅ Conectado ao MySQL');
    
    // Ler e executar script SQL
    const sqlScript = fs.readFileSync(
      path.join(__dirname, '..', 'models', 'init.sql'), 
      'utf8'
    );
    
    // Dividir em comandos individuais
    const commands = sqlScript
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);
    
    console.log(`📝 Executando ${commands.length} comandos SQL...`);
    
    for (const command of commands) {
      if (command.trim()) {
        await connection.execute(command);
      }
    }
    
    console.log('✅ Banco de dados configurado com sucesso!');
    console.log('📊 Dados de exemplo inseridos');
    console.log('🔐 Usuários padrão criados:');
    console.log('   - admin / password');
    console.log('   - user1 / password');
    console.log('   - teste / password');
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;