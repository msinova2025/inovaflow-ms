# MS INOVA MAIS - Backend API

Backend API para a plataforma MS INOVA MAIS, desenvolvido para implantação na nuvem SETDIG.

## Tecnologias

- Node.js 20
- Express.js
- PostgreSQL 16
- Docker

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Lógica de negócio
│   ├── routes/          # Definição de rotas
│   ├── middleware/      # Middlewares (auth, validation)
│   ├── db.js            # Conexão com PostgreSQL
│   └── server.js        # Servidor Express
├── Dockerfile
└── package.json
```

## Desenvolvimento Local

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose

### Instalação

1. Instalar dependências:
```bash
cd backend
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
# Editar .env conforme necessário
```

3. Iniciar banco de dados e API:
```bash
# Na raiz do projeto
docker-compose up
```

A API estará disponível em `http://localhost:3001`

## Endpoints Disponíveis

### Challenges
- `GET /api/challenges` - Listar todos os desafios
- `GET /api/challenges/:id` - Obter desafio por ID
- `POST /api/challenges` - Criar novo desafio
- `PUT /api/challenges/:id` - Atualizar desafio
- `DELETE /api/challenges/:id` - Deletar desafio

### Solutions
- `GET /api/solutions/challenge/:challengeId` - Listar soluções de um desafio
- `POST /api/solutions` - Submeter nova solução
- `PATCH /api/solutions/:id/status` - Atualizar status da solução

## Deploy SETDIG

Ver documentação em `/k8s` para manifestos Kubernetes.
