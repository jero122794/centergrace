# Centro Misionero Shalom — Plataforma

Plataforma PWA de estudios bíblicos, seguimiento espiritual y gestión de ministerios para **Centro Misionero Shalom**.

## Stack

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind, Zustand, TanStack Query, TipTap, next-pwa
- Backend: Node.js 20, Express, Prisma, PostgreSQL 15, Redis 7
- Auth: JWT RS256 (15 min) + refresh opaco rotativo (7 días, cookie HttpOnly)
- Deploy: Docker + Railway (`app.[DOMINIO].com`)

## Arranque local

```bash
cp .env.example .env
docker compose up --build
```

Servicios:

- Web PWA: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs
- Health: http://localhost:3001/api/health

Sin Docker:

```bash
npm install
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
npm run prisma:seed --workspace=apps/api
npm run dev:api
npm run dev:web
```

## Usuarios seed

| Email | Password | Rol |
| --- | --- | --- |
| dev@iglesia.com | Dev123!$ | DEVELOPER |
| admin@iglesia.com | Admin123! | ADMIN |
| lider@iglesia.com | Lider123! | LEADER |
| estudiante@iglesia.com | Estudiante123! | STUDENT |

## Arquitectura

Monorepo npm workspaces:

- `apps/api` — API hexagonal (ports & adapters)
- `apps/web` — PWA
- `packages/types` y `packages/utils` — código compartido

Cada módulo de backend vive en `apps/api/src/modules/[nombre]` con `domain`, `application`, `infrastructure` e `interface`.

## Variables de entorno

Ver `.env.example`. En producción no hay valores por defecto para secretos. El panel Developer (`/developer/entorno`) solo muestra presencia/ausencia.

## Seguridad

Helmet estricto, CORS por `FRONTEND_URL`, rate limit (auth 10/15min, general 100/min, upload 5/min), HPP, sanitización, JWT RS256, rotación de refresh y detección de reuse.

El rol `DEVELOPER` no se asigna, desactiva ni elimina por ningún endpoint.

## CI/CD

`.github/workflows/platform.yml` corre lint, type-check, tests de API y build de web. El job de deploy usa Railway al pushear `main`.
