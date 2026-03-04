# SAAE Linhares - Sistema de Gestão

Sistema web completo para o SAAE Linhares (Serviço Autônomo de Água e Esgoto de Linhares), incluindo portal público e painel administrativo.

## Tech Stack

- **Frontend**: React 18 + TypeScript (Create React App), compilado como build estático
- **Backend**: Node.js + Express + TypeScript, servindo a API e os arquivos do frontend
- **Banco de Dados**: PostgreSQL (Replit built-in database)
- **Autenticação**: JWT + bcryptjs
- **Servidor**: Express na porta 5000, servindo tanto a API quanto o frontend compilado

## Estrutura do Projeto

```
/
├── client/          # Frontend React (CRA)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/    # API calls via Axios
│   │   ├── contexts/    # Auth, Accessibility, Modal, Theme
│   │   └── routes.tsx
│   └── build/       # Frontend compilado (servido pelo Express)
├── server/          # Backend Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   │       └── database.ts  # PostgreSQL connection pool
├── start.sh         # Script de inicialização
└── docker/          # Configurações Docker (não utilizadas no Replit)
```

## Como Funciona

O backend Express roda na porta 5000 e serve:
1. `/api/*` — API REST com autenticação JWT
2. `/uploads/*` — Arquivos de mídia
3. `/*` — Arquivos estáticos do React (`client/build/`)

## Usuário Admin Padrão

- **Email**: admin@saaelinhares.com.br
- **Senha**: admin123

## Variáveis de Ambiente

Configuradas em `server/.env`:
- `DATABASE_URL` — String de conexão PostgreSQL (Replit DB)
- `JWT_SECRET` — Chave para tokens JWT
- `PORT=5000` — Porta do servidor
- `CORS_ORIGIN=*` — Origem permitida pelo CORS

## Workflow

O workflow "Start application" executa `bash start.sh`, que inicia o servidor Express na porta 5000.

## Build do Frontend

Quando alterações forem feitas no frontend (`client/src/`), é necessário reconstruir:
```bash
cd client && REACT_APP_API_URL=/api CI=false npm run build
```

## Banco de Dados

Todas as tabelas foram criadas na instância PostgreSQL do Replit:
- users, news, bids, contracts, carousel, galleries, media
- water_quality, tariffs, settings, pages, faq, dictionary
- cipa, consumption_tips, useful_phones, payment_locations, logs
