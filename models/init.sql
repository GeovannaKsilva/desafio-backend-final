-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS desafio_backend;
USE desafio_backend;

-- Tabela de usuários
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    token VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de clientes
DROP TABLE IF EXISTS clientes;
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sobrenome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    idade INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_idade CHECK (idade > 0 AND idade < 120)
);

-- Tabela de produtos
DROP TABLE IF EXISTS produtos;
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    data_atualizado DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_preco CHECK (preco > 0)
);

-- Inserir dados de exemplo
INSERT INTO usuarios (usuario, senha) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'), 
('user1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('teste', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO clientes (nome, sobrenome, email, idade) VALUES
('João', 'Silva', 'joao.silva@email.com', 30),
('Maria', 'Santos', 'maria.santos@email.com', 25),
('Pedro', 'Oliveira', 'pedro.oliveira@email.com', 35),
('Ana', 'Costa', 'ana.costa@email.com', 28),
('Carlos', 'Lima', 'carlos.lima@email.com', 42);

INSERT INTO produtos (nome, descricao, preco, data_atualizado) VALUES
('Notebook Dell', 'Notebook Dell Inspiron 15 com 8GB RAM e SSD 256GB', 2500.00, '2024-01-15 10:30:00'),
('Mouse Logitech', 'Mouse sem fio Logitech MX Master 3', 350.00, '2024-02-20 14:15:00'),
('Teclado Mecânico', 'Teclado mecânico RGB com switches Cherry MX', 450.00, '2024-03-10 09:45:00'),
('Monitor Samsung', 'Monitor Samsung 24 polegadas Full HD', 800.00, '2024-04-05 16:20:00'),
('Webcam Logitech', 'Webcam Logitech C920 HD', 280.00, '2024-05-12 11:30:00');

-- Verificar se os dados foram inseridos
SELECT 'Usuários cadastrados:' as info;
SELECT COUNT(*) as total FROM usuarios;

SELECT 'Clientes cadastrados:' as info;
SELECT COUNT(*) as total FROM clientes;

SELECT 'Produtos cadastrados:' as info;
SELECT COUNT(*) as total FROM produtos;