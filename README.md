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

La suite de API usa PostgreSQL `platform_test` y Redis locales (también en CI). Cubre:

- Auth: registro, login inválido, rotación de refresh, reuse y logout
- Users: promoción de rol y bloqueo de `DEVELOPER`
- Groups + notas espirituales: aislamiento por líder
- Courses, calificaciones, uploads, settings, notificaciones, alabanza, health

### Checklist QA manual

- [ ] Login de los 4 usuarios seed
- [ ] Estudiante: curso, lección, entrega y avisos
- [ ] Líder: contenido, calificación, seguimiento, setlist, escuela
- [ ] Admin: usuarios e identidad de iglesia
- [ ] Developer: sistema, servicios, jobs, entorno (sin valores secretos)
- [ ] Logout invalida la sesión (no se puede refrescar)

## Deploy

El job `deploy` de GitHub Actions corre **solo en `main`** y **no falla** si faltan secretos: omite Railway o Vercel y deja un aviso en el log.

### Secretos de GitHub (Settings → Secrets and variables → Actions)

| Secret / variable | Uso |
| --- | --- |
| `RAILWAY_TOKEN` | Token de proyecto Railway |
| `RAILWAY_SERVICE` (variable opcional) | Nombre del servicio, default `platform-api` |
| `VERCEL_TOKEN` | Token de Vercel |
| `VERCEL_ORG_ID` | Org de Vercel |
| `VERCEL_PROJECT_ID` | Proyecto de la PWA |

### API — Railway

1. Crear proyecto y añadir PostgreSQL + Redis.
2. Servicio API con Dockerfile `apps/api/Dockerfile` (`railway.toml`).
3. Variables: las de `.env.example` (JWT PEM, VAPID, `FRONTEND_URL` de Vercel, `DATABASE_URL`, `REDIS_URL`).
4. Healthcheck: `GET /api/health`.
5. Guardar `RAILWAY_TOKEN` en GitHub. Un push a `main` ejecuta `railway up --ci`.

Railway también puede desplegar al conectar el repo (sin Actions). El workflow es la vía CI.

### Web — Vercel

1. Importar el repo. Root Directory `apps/web` o usar `vercel.json` de la raíz.
2. Environment:
   - `NEXT_PUBLIC_API_URL` = URL pública de Railway
   - `NEXT_PUBLIC_VAPID_KEY` = misma clave pública que el API
3. Guardar `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`.

DNS sugerido: `app.tudominio.com` → Vercel, `api.tudominio.com` → Railway.

Este entorno de desarrollo no tiene esos tokens: el código y el pipeline quedan listos; la primera publicación la hace el dueño del repo al cargar los secretos y mergear a `main`.

## CI

`.github/workflows/platform.yml` corre lint, type-check, tests de API (Postgres 15 + Redis 7) y build de web en cada PR a `main`.
