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
- Supabase (Backend)

## Requisitos

- Node.js 18+
- npm ou bun

## Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Acesse o diretório
cd ms-inova-mais

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Copie o .env.example para .env e preencha as variáveis
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_PROJECT_ID=seu_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=sua_anon_key
VITE_SUPABASE_URL=sua_url_supabase
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção localmente

## Estrutura do Projeto

```
src/
├── assets/        # Imagens e recursos estáticos
├── components/    # Componentes React
│   ├── admin/     # Componentes do painel administrativo
│   ├── layout/    # Header, Footer e layouts
│   └── ui/        # Componentes de UI (shadcn)
├── hooks/         # Custom hooks
├── integrations/  # Integrações (Supabase)
├── lib/           # Utilitários
├── pages/         # Páginas da aplicação
└── index.css      # Estilos globais
```

## Deploy

### Vercel

1. Importe o repositório na Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. Deploy automático a cada push

### Variáveis na Vercel

Configure as seguintes variáveis em Settings > Environment Variables:

| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_PROJECT_ID` | ID do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave anônima do Supabase |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |

## Licença

© 2026 MS INOVA MAIS - Governo do Estado de Mato Grosso do Sul. Todos os direitos reservados.
