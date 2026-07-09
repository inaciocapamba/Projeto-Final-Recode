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
```

# DuoTec API - Documentação do Back-end

Esta é a API REST do projeto DuoTec, desenvolvida em **Java Spring Boot**, utilizando **MySQL** para persistência de dados e criptografia de segurança **BCrypt**.

---

## Tecnologias Utilizadas
* **Java 17+**
* **Spring Boot 3**
* **Spring Data JPA**
* **jBCrypt** (Segurança e hashing de senhas)
* **MySQL / H2 Database**

---

## Lista de Endpoints da API

### 1. Gerenciamento de Usuários e Autenticação (`/api/usuarios`)

* **POST `/api/usuarios/cadastro`**
  * **Descrição:** Realiza o registro de um novo usuário na plataforma. Aplica criptografia via BCrypt na senha informada.
  * **Regra de Negócio:** Retorna erro `400 Bad Request` se o e-mail já estiver cadastrado.
  * **Resposta de Sucesso (201 Created):** Retorna o objeto do usuário salvo.

* **POST `/api/usuarios/login`**
  * **Descrição:** Autentica um usuário na plataforma comparando o hash da senha enviada.
  * **Resposta de Sucesso (200 OK):** Retorna os dados cadastrais do usuário autenticado.
  * **Resposta de Erro (411 Unauthorized):** `"Email ou senha incorreto."`

* **GET `/api/usuarios`**
  * **Descrição:** Retorna a lista completa de usuários cadastrados no banco.
  * **Resposta (200 OK):** Array de objetos contendo `id`, `name`, `email`, `accountType`, `lives` e `days`.

* **PUT `/api/usuarios/{usuarioId}`**
  * **Descrição:** Atualiza o perfil (nome, e-mail e opcionalmente a senha) do usuário.
  * **Regra de Negócio:** Impede a operação se o novo e-mail já pertencer a outra conta existente no sistema.

* **PATCH `/api/usuarios/{usuarioId}/decrementar-vida`**
  * **Descrição:** Deduz 1 unidade do contador de vidas (`lives`) do usuário ao errar um desafio.
  * **Regra de Negócio:** Se o usuário já possuir 0 vidas, retorna erro impossibilitando o decremento.

* **PATCH `/api/usuarios/{usuarioId}/atualizar-ofensiva`**
  * **Descrição:** Incrementa o contador de dias de ofensiva (`days`) do usuário utilizando um parâmetro de consulta (`?quantidade=X`).

---

### 2. Conteúdos e Módulos (`/api/conteudos`)

* **GET `/api/conteudos`**
  * **Descrição:** Lista de forma sequencial todos os módulos e trilhas cadastrados.

* **POST `/api/conteudos`**
  * **Descrição:** Permite à administração a criação e persistência de novos módulos de estudo.

---

### 3. Banco de Questões (`/api/questoes`)

* **GET `/api/questoes/conteudo/{conteudoId}`**
  * **Descrição:** Retorna a coleção completa de desafios e testes vinculados de forma estrita a um módulo ou conteúdo específico.

* **GET `/api/questoes/conteudo`**
  * **Descrição:** Retorna todas as questões registradas globalmente no ecossistema.

* **POST `/api/questoes`**
  * **Descrição:** Permite a inserção manual de novos quizzes (enunciado, resposta correta e incorreta) associados a uma chave estrangeira.

---

### 4. Controle de Progresso (`/api/progresso`)

* **GET `/api/progresso/usuario/{usuarioId}`**
  * **Descrição:** Lista as lições completas e o andamento acadêmico atual mapeado para um aluno específico.

* **POST `/api/progresso/concluir`**
  * **Descrição:** Altera a flag de status de uma lição (`concluido = true`) e grava a data exata do servidor via `LocalDateTime.now()`.

---

## Como Rodar o Ambiente Localmente

1. Certifique-se de que a porta `8080` esteja livre na máquina local.
2. Certifique-se de configurar as variáveis de conexão com o banco de dados no arquivo `src/main/resources/application.properties`.
3. Na pasta raiz do back-end, execute o Maven wrapper para baixar as dependências e iniciar o ciclo de vida do Spring Boot:
   ```bash
   ./mvnw spring-boot:run

# DuoTec Web - Documentação do Front-end

A interface do utilizador do DuoTec é uma **SPA (Single Page Application)** responsiva e dinâmica desenvolvida em **React** com o ecossistema de build **Vite** e estilização baseada em **PrimeIcons** para os indicadores visuais.

---

## Tecnologias Utilizadas
* **React** (v18+)
* **Vite** (Ambiente de build rápido)
* **PrimeIcons** (Biblioteca de ícones nativos)
* **CSS3** (Estilização modular e estruturada por componentes)

---

## Estrutura de Páginas e Consumo de Endpoints

O ecossistema do front-end é gerenciado por uma navegação de estados baseada na função `onNavigate`, alternando dinamicamente as seguintes telas principais:

### 1. Portal de Entrada & Boas-Vindas (`FirstPage.jsx`)
* **Descrição:** Apresenta a proposta de valor do DuoTec (lições curtas de 10 minutos, projetos práticos e comunidade). Inclui um modal de Login flutuante (`Dialog` da biblioteca local) para autenticação.
* **Endpoints Consumidos:**
  * `POST /api/usuarios/login` - Envia o objeto `LoginRequest` (`email` e `password`) para autenticação e armazena o `usuario_id` e `accountType` no `localStorage`.

### 2. Cadastro de Novas Contas (`SignUp.jsx`)
* **Descrição:** Formulário de registo dividido entre os perfis **Estudante (`student`)** e **Administrador (`admin`)**. 
* **Regra de Negócio Visual:** Caso o tipo selecionado seja `admin`, um campo extra oculto para inserção da *Chave de Acesso Admin* (`adminKey`) é renderizado no ecrã.
* **Endpoints Consumidos:**
  * `POST /api/usuarios/cadastro` - Submete os dados estruturados (`name`, `email`, `password`, `accountType`, `adminKey`) para criação segura da conta.

### 3. Painel do Aluno / Mapa da Trilha (`StudentPage.jsx`)
* **Descrição:** O coração da experiência do aluno. Renderiza um cabeçalho fixo com o painel de status em tempo real do utilizador, exibindo o contador de Vidas Restantes (`lives`) e Dias de Ofensiva (`days`). Abaixo, desenha a trilha vertical de módulos de aprendizagem sequenciais interconectados.
* **Endpoints Consumidos:**
  * `GET /api/usuarios` - Utilizado para localizar a lista de utilizadores e filtrar os dados específicos da sessão ativa do aluno.
  * `GET /api/conteudos` - Puxa a lista completa de módulos registados para renderizar dinamicamente cada círculo de conteúdo (`ModuleCircle`) e as linhas de ligação do mapa.

### 4. Interface da Lição & Gameplay (`LessonPage.jsx`)
* **Descrição:** Divide o ecrã em duas secções fundamentais para a gamificação:
  1. **Painel Teórico:** Player com vídeo incorporado do YouTube (via Iframe).
  2. **Painel Prático (Quiz):** Renderiza o passo a passo de questões. Contém o algoritmo que quebra as respostas incorretas por vírgula (`.split(',')`), junta com a correta e embaralha a ordenação no grid visual usando o Hook `useEffect`.
* **Endpoints Consumidos:**
  * `GET /api/questoes/conteudo/{conteudoId}` - Carrega todas as perguntas associadas ao módulo iniciado.
  * `PATCH /api/usuarios/{usuarioId}/decrementar-vida` - Disparado automaticamente ao submeter uma resposta incorreta.
  * `POST /api/progresso/concluir` - Grava o status de conclusão da lição ao atingir o último step.
  * `PATCH /api/usuarios/{usuarioId}/atualizar-ofensiva?quantidade=1` - Incrementa os dias de ofensiva acumulados do utilizador ao fechar o ecrã de sucesso.

### 5. Edição do Perfil do Utilizador (`ProfilePage.jsx`)
* **Descrição:** Área segura que exibe o resumo da conta e disponibiliza um modo de edição para alteração do Nome, E-mail e redefinição opcional de Senha. Também centraliza a ação de encerrar a sessão limpando os dados armazenados.
* **Endpoints Consumidos:**
  * `GET /api/usuarios` - Sincroniza e preenche o formulário com as strings vigentes no banco de dados.
  * `PUT /api/usuarios/{usuarioId}` - Envia as alterações validadas do formulário para atualização no servidor.

### 6. Painel de Controle do Administrador (`AdminPage.jsx`)
* **Descrição:** Ecrã restrito que apresenta métricas consolidadas em cartões dinâmicos (Total de Usuários e Total de Questões) e integra um formulário avançado de cadastro para novas perguntas vinculadas aos módulos existentes.
* **Endpoints Consumidos:**
  * `GET /api/usuarios` - Conta a volumetria total de perfis criados no sistema.
  * `GET /api/questoes/conteudo` - Obtém todas as perguntas globais para exibição na métrica.
  * `GET /api/conteudos` - Preenche o menu de seleção (`<select>`) para associar a nova questão ao seu respectivo ID de conteúdo.
  * `POST /api/questoes` - Envia o formulário de cadastro de nova questão para persistência definitiva no banco de dados.


