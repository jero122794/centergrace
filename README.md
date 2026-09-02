# Centro Misionero Shalom — Plataforma

PWA de estudios bíblicos, seguimiento espiritual y gestión de ministerios para **Centro Misionero Shalom**.

## Stack

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind, Zustand, TanStack Query, TipTap, next-pwa
- Backend: Node.js 20, Express, Prisma, PostgreSQL 15, Redis 7
- Auth: JWT RS256 (15 min) + refresh opaco rotativo (7 días, cookie HttpOnly)
- Push: Web Push VAPID + centro de notificaciones in-app
- Deploy: API en Railway (Docker), web en Vercel

## Arranque local

El archivo de entorno está en la **raíz** del repo (`.env.example`). Hay una copia en `apps/api/.env.example`. Prisma y el seed necesitan `DATABASE_URL`; Postgres y Redis deben estar arriba **antes** de migrar.

El aviso `npm warn deprecated eslint@8` y el reporte de `npm audit` no bloquean el arranque. No ejecutes `npm audit fix --force`.

```bash
npm install
npm run setup:local
docker compose up -d postgres redis
npm run db:migrate
npm run db:seed
npm run dev
```

`setup:local` copia `.env.example` a `.env`, `apps/api/.env` y `apps/web/.env.local` si aún no existen. Equivale a:

```bash
cp .env.example .env
cp .env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Todo en Docker (API + web + Postgres + Redis):

```bash
cp .env.example .env
docker compose up --build
```

Servicios:

| Recurso | URL |
| --- | --- |
| Inicio público | http://localhost:3000 |
| Web PWA | http://localhost:3000/dashboard |
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
5. QA + deploy: tests HTTP y de formato, CI GitHub Actions, identidad visual, Dockerfiles, Railway + Vercel

## Identidad visual

Paleta olivo / pergamino / oro, tipografía Libre Baskerville + Source Sans 3, sidebar oscura y superficies cálidas. La landing pública está en `/`; el login usa un panel bíblico a la izquierda en escritorio.

## Variables de entorno

Ver `.env.example` (raíz y `apps/api/.env.example`) y `apps/web/.env.example` (PWA). En producción no hay valores por defecto para secretos. El panel Developer (`/developer/entorno`) solo muestra presencia/ausencia.

Obligatorias en producción: `DATABASE_URL`, `REDIS_URL`, JWT PEM, `JWT_REFRESH_SECRET`, VAPID, `FRONTEND_URL`.

Opcionales: AWS S3/SES (sin ellas los uploads quedan en disco del contenedor) y Google OAuth.

Frontend (inyectar **en el build** de Vercel o como build-args de Docker):

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
npm run test --workspace=apps/web
npm run type-check
npm run lint
```

La suite de API usa PostgreSQL `platform_test` y Redis locales (también en CI). Cubre:

- Auth: registro, login inválido, rotación de refresh, reuse y logout
- Users: promoción de rol y bloqueo de `DEVELOPER`
- Groups + notas espirituales: aislamiento por líder
- Courses, calificaciones, uploads, settings, notificaciones, alabanza, health

La suite web cubre fechas en `America/Bogota` y el mapeo de errores de API.

### Checklist QA manual

- [ ] Landing `/` y login de los 4 usuarios seed
- [ ] Estudiante: curso, lección, entrega y avisos
- [ ] Líder: contenido, calificación, seguimiento, setlist, escuela
- [ ] Admin: usuarios e identidad de iglesia
- [ ] Developer: sistema, servicios, jobs, entorno (sin valores secretos)
- [ ] Logout invalida la sesión (no se puede refrescar)
- [ ] Mobile: barra inferior de 4 ítems; tablet: menú hamburguesa; desktop: sidebar fija

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
3. Variables: las de `.env.example` (JWT PEM, VAPID, `FRONTEND_URL` de Vercel, `DATABASE_URL`, `REDIS_URL`). `PORT` lo asigna Railway.
4. Healthcheck: `GET /api/health`.
5. Guardar `RAILWAY_TOKEN` en GitHub. Un push a `main` ejecuta `railway up --ci`.

Railway también puede desplegar al conectar el repo (sin Actions). El workflow es la vía CI.

### Web — Vercel

1. Importar el repo. **Root Directory: `apps/web`**.
2. Environment (Production y Preview):
   - `NEXT_PUBLIC_API_URL` = URL pública de Railway
   - `NEXT_PUBLIC_VAPID_KEY` = misma clave pública que el API
3. Guardar `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`.
4. En Railway, `FRONTEND_URL` debe ser el dominio de Vercel (CORS y cookies).
5. En producción la cookie de refresh va con `SameSite=None; Secure` para que el login funcione entre `*.vercel.app` y `*.up.railway.app`. CORS solo permite `FRONTEND_URL`.

DNS sugerido: `app.tudominio.com` → Vercel, `api.tudominio.com` → Railway.

Este entorno de desarrollo no tiene esos tokens: el código y el pipeline quedan listos; la primera publicación la hace el dueño del repo al cargar los secretos y mergear a `main`.

## CI

`.github/workflows/platform.yml` corre lint, type-check, tests de API (Postgres 15 + Redis 7), tests de web y build de Next.js en cada PR a `main`.
