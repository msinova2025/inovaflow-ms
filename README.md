# MS INOVA MAIS

Plataforma de inovação do Governo do Estado de Mato Grosso do Sul.

## Sobre o Projeto

O MS INOVA MAIS é uma plataforma que conecta desafios de inovação com soluções criativas, promovendo a transformação digital e o desenvolvimento sustentável no estado.

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Node.js (Backend Próprio)
- PostgreSQL (Banco de Dados)

## Requisitos

- Node.js 20+
- PostgreSQL 16
- npm

## Instalação

```bash
# Clone o repositório
git clone <URL_DO_GITLAB>

# Instale as dependências do Frontend
npm install

# Instale as dependências do Backend
cd backend
npm install
```

## Configuração Local

1.  **Backend**: Configure o banco de dados no arquivo `backend/.env` (veja `backend/.env.example`).
2.  **Frontend**: Configure a URL da API no arquivo `.env` (veja `.env.example`).

## Scripts Disponíveis

- `npm run dev` - Inicia o Frontend em modo desenvolvimento
- `npm start` (no backend) - Inicia a API
- `npm run build` - Gera a build de produção do Frontend

## Estrutura do Projeto

```
.
├── backend/       # API Node.js/Express
├── database/      # Scripts SQL e Schema
├── k8s/           # Manifestos Kubernetes (SETDIG)
├── src/           # Frontend React
└── public/        # Recursos estáticos
```

## Deploy (SETDIG)

O deploy é automatizado via GitLab CI/CD nas branches:
- `hom`: Ambiente de Homologação
- `prd`: Ambiente de Produção

### Variáveis Necessárias (Kubernetes Secrets)

| Secret | Descrição |
|----------|-----------|
| `K0420-db-credentials` | Host, User, Password e Database do Postgres |
| `K0420-jwt-secret` | Chave secreta para tokens JWT |

## Licença

© 2026 MS INOVA MAIS - Governo do Estado de Mato Grosso do Sul. Todos os direitos reservados.
