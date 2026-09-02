# Centro Misionero Shalom — Plataforma

PWA de estudios bíblicos, seguimiento espiritual y gestión de ministerios para **Centro Misionero Shalom**.

## Stack

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind, Zustand, TanStack Query, TipTap, next-pwa
- Backend: Node.js 20, Express, Prisma, PostgreSQL 15, Redis 7
- Auth: JWT RS256 (15 min) + refresh opaco rotativo (7 días, cookie HttpOnly)
- Push: Web Push VAPID + centro de notificaciones in-app
- Deploy: API en Railway (Docker), web en Vercel

## Arranque local

```bash
cp .env.example .env
docker compose up --build
```

Sin Docker:

```bash
npm install
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
npm run prisma:seed --workspace=apps/api
npm run dev:api
npm run dev:web
```

Servicios:

| Recurso | URL |
| --- | --- |
| Web PWA | http://localhost:3000 |
| API | http://localhost:3001 |
| Swagger | http://localhost:3001/api/docs |
| Health | http://localhost:3001/api/health |

## Usuarios seed

| Email | Password | Rol |
| --- | --- | --- |
| dev@iglesia.com | Dev123!$ | DEVELOPER |
| admin@iglesia.com | Admin123! | ADMIN |
| lider@iglesia.com | Lider123! | LEADER |
| estudiante@iglesia.com | Estudiante123! | STUDENT |

## Arquitectura

Monorepo npm workspaces:

- `apps/api` — API hexagonal (`domain` / `application` / `infrastructure` / `interface`)
- `apps/web` — PWA Next.js
- `packages/types` y `packages/utils` — código compartido

Módulos de API: auth, users, ministries, groups, courses, devotionals, submissions, spiritual-notes, worship, notifications, settings, uploads, dashboard, developer.

## Fases

1. Fundación: Docker, Prisma, auth RS256, login/register, PWA base
2. Backend: users/RBAC, grupos, cursos, devocionales, pagos/calificaciones, tesorería ministerial, alabanza
3. Frontend: dashboards, editor de lección (YouTube oEmbed + TipTap), calificación lado a lado, seguimiento espiritual, setlist
4. PWA + notificaciones: service worker, Web Push, centro de avisos, cron jobs, escuela/equipo de alabanza
5. QA + deploy: tests HTTP, CI GitHub Actions, Dockerfiles, Railway + Vercel

## Variables de entorno

Ver `.env.example`. En producción no hay valores por defecto para secretos. El panel Developer (`/developer/entorno`) solo muestra presencia/ausencia.

Frontend:

```
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_VAPID_KEY=<misma clave pública VAPID>
```

## PWA y notificaciones

- Manifest en `apps/web/public/manifest.json` (`standalone`, `portrait-primary`)
- Service worker con NetworkFirst para `/api` y CacheFirst para estáticos
- Fallback offline en `/offline`
- Worker custom (`apps/web/worker/index.js`) para eventos `push` y `notificationclick`
- El centro `/notificaciones` funciona en HTTP; Web Push del sistema requiere HTTPS (o localhost) y build de producción (`next-pwa` se desactiva en `development`)

## Seguridad

Helmet, CORS por `FRONTEND_URL`, rate limit (auth 10/15min, general 100/min, upload 5/min), HPP, sanitización, JWT RS256, rotación de refresh y detección de reuse.

El rol `DEVELOPER` no se asigna, desactiva ni elimina por ningún endpoint.

## Tests

```bash
npm run test --workspace=apps/api
npm run type-check
npm run lint
```

La suite de API usa PostgreSQL `platform_test` y Redis locales (también en CI).

## Deploy

### API — Railway

1. Crear proyecto y servicio a partir de este repo.
2. Builder: Dockerfile (`apps/api/Dockerfile`) — ya definido en `railway.toml`.
3. Añadir PostgreSQL y Redis en el mismo proyecto y vincular `DATABASE_URL` / `REDIS_URL`.
4. Copiar el resto de variables de `.env.example` (JWT PEM, VAPID, `FRONTEND_URL` del dominio Vercel).
5. Healthcheck: `GET /api/health`.
6. Guardar `RAILWAY_TOKEN` en GitHub Secrets para el job `deploy` de `.github/workflows/platform.yml` (solo corre en `main`).

### Web — Vercel

1. Importar el repo y usar Root Directory `apps/web` **o** el `vercel.json` de la raíz.
2. Environment:
   - `NEXT_PUBLIC_API_URL` = URL pública de Railway
   - `NEXT_PUBLIC_VAPID_KEY` = misma clave pública que el API
3. Framework preset: Next.js.

DNS sugerido: `app.tudominio.com` → Vercel, `api.tudominio.com` → Railway.

Sin `RAILWAY_TOKEN` ni proyecto Vercel, el código queda listo para publicar pero el deploy no se ejecuta desde este entorno.

## CI

`.github/workflows/platform.yml` corre lint, type-check, tests de API (Postgres 15 + Redis 7) y build de web en cada PR a `main`.
