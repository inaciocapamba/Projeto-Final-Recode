# Projeto-Final-Recode
DuoTec é uma plataforma web gamificada, inspirada no modelo do Duolingo, desenvolvida para simplificar e nivelar o aprendizado inicial de lógica de programação e tecnologia para estudantes e iniciantes.
# DuoTec - Transforma Futuros

## Seção 1 - Sobre o Projeto

* **Nome do Projeto:** DuoTec
* **ODS Escolhidas:** 
  * **ODS 4 – Educação de Qualidade:** Desenvolve um ecossistema inclusivo e gamificado focado no nivelamento de conceitos fundamentais de lógica de programação para novos alunos.
  * **ODS 10 – Redução das Desigualdades:** Democratiza o acesso ao conhecimento inicial de tecnologia, oferecendo suporte contínuo para diminuir o "choque de complexidade" em TI.
* **Aluno:** Inácio Capamba
* **Objetivo do Projeto:** Mitigar as altas taxas de evasão escolar e o sentimento de frustração inicial enfrentado por estudantes e jovens adultos que começam na área de tecnologia. O DuoTec quebra barreiras e transforma o estudo abstrato de algoritmos em micro-conquistas gamificadas utilizando mecânicas de vidas e dias de ofensiva.

---

## Seção 2 - Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado (versão 18+)
* Java JDK 17+ instalado
* IDE de sua preferência (VS Code, IntelliJ IDEA ou Eclipse)

### Como rodar o Front-end (React + Vite)
1. Navegue até a pasta do front-end:
   ```bash
   cd FRONT-END
2. Instale as dependências do projeto:
   ```bash
   npm install
3. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev

### Como rodar o Back-end (Java Spring Boot)
1. Navegue até a pasta correspondente ao back-end:
   ```bash
   cd BACK-END
2. Execute a aplicação utilizando o Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
O servidor backend estará rodando localmente em: http://localhost:8080

### Banco de Dados
Nome do arquivo do script SQL: schema.sql (localizado na raiz deste repositório).

# Script de Banco de Dados - DuoTec

Este documento apresenta a estrutura do banco de dados relacional utilizada no ecossistema DuoTec. O esquema foi inteiramente mapeado de acordo com as anotações de persistência (Hibernate/JPA) presentes nas entidades da aplicação.

---

## Script SQL (`schema.sql`)

```sql
CREATE DATABASE IF NOT EXISTS duotec;
USE duotec;

CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    account_type VARCHAR(50),
    admin_key VARCHAR(255),
    lives INT DEFAULT 5,
    days INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS conteudos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    modulo VARCHAR(255) NOT NULL,
    video_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS questoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    enunciado VARCHAR(255) NOT NULL,
    resposta_correta VARCHAR(255) NOT NULL,
    resposta_incorreta VARCHAR(255),
    conteudo_id BIGINT,
    CONSTRAINT fk_questao_conteudo FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progresso_usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    conteudo_id BIGINT,
    concluido BOOLEAN DEFAULT FALSE,
    data_conclusao TIMESTAMP,
    CONSTRAINT fk_progresso_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_progresso_conteudo FOREIGN KEY (conteudo_id) REFERENCES conteudos(id) ON DELETE CASCADE
);

INSERT INTO conteudos (id, titulo, modulo, video_url) VALUES 
(1, 'Módulo 2: Introdução a Python', 'python', '[https://www.youtube.com/watch?v=rfscVS0vtbw](https://www.youtube.com/watch?v=rfscVS0vtbw)'),
(2, 'Módulo 3: Estrutura de Dados', 'Dados', '[https://youtube.com/](https://youtube.com/)...');

INSERT INTO questoes (enunciado, resposta_correta, resposta_incorreta, conteudo_id) VALUES 
('Qual operador em Python é usado para verificar se dois valores são iguais?', '==', '!=, ===, equal', 1),
('Qual comando é utilizado para exibir uma mensagem na tela em Python?', 'print()', 'printf(), console.log(), println()', 1),
('Como se declara uma variável do tipo string (texto) corretamente em Python?', 'nome = "DuoTec"', 'let, const, var', 1);

