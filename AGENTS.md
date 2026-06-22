# AGENTS.md

## Quick Start

```bash
pnpm install
pnpm run dev          # dev server on port 4321 (auto-opens, strictPort)
pnpm run build        # production build → dist/
```

**No test suite or lint script exists.** ESLint config is present (`eslint.config.js`) but `package.json` has no `lint` script. Build (`npm run build`) is the only verification command.

## Architecture

React 19 + Vite 6.3.5 + TailwindCSS 4 + shadcn/ui (JSX, not TSX).

**Entry flow:** `src/main.jsx` → `src/App.jsx` (wraps `ThemeProvider` → `PermissionProvider` → `RouterProvider`) → `src/routes/routes.jsx`.

**State layers:**
- **Zustand** (`src/store/authStore.js`): auth state only, persisted to encrypted sessionStorage
- **React Context** (`src/contexts/`): `PermissionContext` (RBAC) and `ThemeContext` (dark/light)

**API:** Single Axios instance (`src/api/axiosService.js`) with JWT auto-refresh interceptors. All services use this instance. Base URL from `VITE_API_URL` env var.

**RBAC:** Three user groups (Administrador, Tecnico, Administrativo) with permission constants in `src/constants/permissions.js`. Routes protected via `<ProtectedRoute permission={PERMISSIONS.X}>` and `<AuthGuard>`.

## Conventions

- **Path alias:** `@/` → `src/` (vite.config.js + jsconfig.json)
- **Component files:** PascalCase `.jsx` (e.g., `FichaTecnicaForm.jsx`)
- **Utilities/hooks:** camelCase `.js`
- **UI components:** shadcn/ui in `src/components/ui/` (new-york style, Radix primitives, Lucide icons)
- **Feature folders:** `src/components/<Feature>/` (e.g., `FichaTecnica/`, `Auth/`, `FichaIngreso/`)
- **Language:** UI text and most code comments are Spanish
- **CSS:** TailwindCSS 4 with `tailwindcss-animate`; theme via class strategy (`light`/`dark` on `<html>`)

## Key Gotchas

- `.env` is committed with real values (API URLs, credentials). Do not add secrets.
- No TypeScript — all source is `.jsx`/`.js` with jsconfig.json for path resolution.
- `package-lock.json` is gitignored. `pnpm-lock.yaml` is committed (required for Docker builds). Run `pnpm install` to regenerate.
- ESLint config targets React 18.3 in settings but project uses React 19 — minor mismatch, don't "fix" it.
- Dockerfile uses Node 22 (bookworm-slim) for build (pnpm 11 requires Node >= 22.13).
- Deploy CI (`.github/workflows/deploy.yml`) pushes to `main` via SSH + docker compose.

## Git

- Branches from `develop`: `feature/*`, `fix/*`, `chore/*`
- Commits: Conventional Commits — `feat(scope): desc`, `fix(scope): desc`, `chore(scope): desc`
- PRs target `develop`, not `main`
