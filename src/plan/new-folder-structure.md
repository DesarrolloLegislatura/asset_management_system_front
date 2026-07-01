# Plan de migración — Estructura feature-based (Opción A/D)

> **Objetivo:** introducir una estructura *feature-based* que conviva con la estructura
> actual, sin migrar los dominios de negocio existentes (fichas). Se crea una capa
> `shared/` como fundación y se usa **tickets** como feature piloto (solo andamiaje).
>
> **Fuera de alcance:** refactors, limpieza de código, renombrados no imprescindibles,
> extracción de `baseURL` a `.env`, y cualquier lógica funcional real de tickets.
> Los dominios legacy (`FiachaTecnica`, `FichaIngreso`, `FichaToner`, `Iventario`)
> **no se tocan** salvo por la actualización mecánica de imports al mover `components/ui`.

## Contexto técnico verificado

- **Stack:** React 19, Vite 6 (`@vitejs/plugin-react-swc`), React Router 7, Zustand 5,
  Tailwind 4, shadcn/radix, Axios, Zod + react-hook-form.
- **Alias `@` → `src`** ya configurado en `vite.config.js` y `jsconfig.json`.
  → `@/shared/*` y `@/features/*` resolverán automáticamente. **No requiere cambios de config.**
- **Grafo de imports relevante (medido):**
  - `@/components/ui` lo consumen 8 archivos externos + `form.jsx` (intra-ui).
  - `axiosService` lo importan 4 servicios en `src/api/` vía `./axiosService`.
  - Los guards los importa `src/routes/routes.jsx` vía `./AuthGuard.jsx` / `./GroupsGuard.jsx`.
  - `@/lib/utils` (`cn`) lo usan 15 archivos de `ui/` **vía alias** → **`lib/` se queda donde está**;
    mover `ui/` no rompe esos imports.
  - `components.json` (shadcn) apunta `ui → @/components/ui`; hay que actualizarlo al mover.

## Estructura objetivo (al terminar el plan)

```
src/
├── shared/                 # capa transversal (fundación)
│   ├── ui/                 # ← desde components/ui
│   ├── api/                # ← axiosService (base)
│   └── auth/               # ← AuthGuard, GroupsGuard
├── features/
│   ├── README.md           # convención de la estructura
│   └── tickets/            # feature piloto (solo andamiaje)
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── store/
│       ├── pages/
│       ├── constants/
│       ├── schemas/
│       ├── routes.jsx      # sub-rutas del módulo
│       ├── index.js        # API pública del feature
│       └── plan/           # este documento
│   ── ── LEGACY (sin tocar) ── ──
├── components/ (FiachaTecnica, FichaIngreso, FichaToner, Iventario, Auth, Error)
├── api/  hooks/  store/  layouts/  routes/  constants/  lib/  utils/  statics/
```

**Regla de dependencias:** `shared → features`. `shared` no importa de `features`;
los features no se importan entre sí salvo por su `index.js`.

---

## Features (unidades commiteables independientes)

Orden recomendado: **F1 → F2 → F3** (fundación, mutuamente independientes) →
**F4 → F5** (piloto) → **F6** (docs, en cualquier momento).

### F1 — `shared/ui`: mover el design system ✅ COMPLETADO

**Mover** (usar `git mv` para preservar historial) todo `src/components/ui/*` → `src/shared/ui/`:
`avatar, badge, button, card, dropdown-menu, form, input, label, select, separator,
sheet, skeleton, table, tabs` (15 archivos).

**Actualizar imports** `@/components/ui` → `@/shared/ui` en:
- `src/layouts/Navbar.jsx`
- `src/components/FichaIngreso/FichaIngresoList.jsx`
- `src/components/FichaIngreso/FichaIngresoForm.jsx`
- `src/components/FichaIngreso/FichaIngresoDetail.jsx`
- `src/components/Auth/LoginForm.jsx`
- `src/components/Error/NotFound.jsx`
- `src/components/FiachaTecnica/FichaTecnicaDetail.jsx`
- `src/components/FiachaTecnica/FichaTecnicaForm.jsx`
- `src/shared/ui/form.jsx` (referencias intra-ui, si las hubiera)

**Actualizar** `components.json`: alias `"ui": "@/shared/ui"`
(dejar `"utils": "@/lib/utils"` intacto).

- **Dependencias:** ninguna.
- **Notas:** no se modifica el contenido de los componentes; los imports de `cn`
  (`@/lib/utils`) no cambian.
- **Hecho cuando:** `grep -rn "components/ui" src` = 0 resultados;
  `npm run build` y `npm run lint` pasan; login y listado renderizan igual que antes.

### F2 — `shared/api`: mover el cliente Axios base ✅ COMPLETADO

**Mover** `src/api/axiosService.js` → `src/shared/api/axiosService.js` (`git mv`).

**Actualizar imports** `./axiosService` → `@/shared/api/axiosService` en:
- `src/api/fichaTecnicaService.js`
- `src/api/estadoService.js`
- `src/api/authService.js`
- `src/api/dependenciaService.js`

- **Dependencias:** ninguna (independiente de F1).
- **Notas:** el archivo se mueve **tal cual**. `baseURL` sigue hardcodeada
  (extraerla a `.env` es un refactor fuera de este plan). Su import de
  `@/store/authStore` (alias) no se ve afectado.
- **Hecho cuando:** `grep -rn "./axiosService" src/api` = 0;
  `npm run build` y `npm run lint` pasan; una petición autenticada (p. ej. login)
  sigue funcionando contra la API.

### F3 — `shared/auth`: mover los guards

**Mover** `src/routes/AuthGuard.jsx` y `src/routes/GroupsGuard.jsx` → `src/shared/auth/` (`git mv`).

**Ajustes de import obligatorios por el cambio de profundidad:**
- En `AuthGuard.jsx`: `../store/authStore` → `@/store/authStore`.
- (`GroupsGuard.jsx` ya usa alias `@`, sin cambios.)

**Actualizar** `src/routes/routes.jsx`:
- `./AuthGuard.jsx` → `@/shared/auth/AuthGuard.jsx`
- `./GroupsGuard.jsx` → `@/shared/auth/GroupsGuard.jsx`

- **Dependencias:** ninguna (independiente de F1 y F2).
- **Hecho cuando:** `grep -rn "\./AuthGuard\|\./GroupsGuard" src/routes` = 0;
  las rutas siguen protegidas (redirección a `/auth/login` sin sesión y control por grupos);
  `npm run build` y `npm run lint` pasan.

### F4 — Andamiaje de la feature `tickets`

**Crear** el árbol bajo `src/features/tickets/` (carpetas vacías con `.gitkeep`
donde no haya contenido aún):
- `api/.gitkeep`
- `components/.gitkeep`
- `hooks/.gitkeep`
- `store/.gitkeep`
- `constants/.gitkeep`
- `schemas/.gitkeep`
- `pages/TicketsPage.jsx` — placeholder que renderiza un `Card` de `@/shared/ui`
  con el texto "Tickets — en construcción".
- `routes.jsx` — exporta el/los objeto(s) de ruta del módulo (path `tickets`,
  `element: <TicketsPage/>`). Aún **no** se monta en el router raíz.
- `index.js` — API pública del feature: re-exporta las rutas (`export { ticketsRoutes } from './routes'`).

- **Dependencias:** F1 (el placeholder importa `@/shared/ui/card`).
- **Notas:** sin lógica de negocio, sin llamadas a API, sin store real.
- **Hecho cuando:** `import { ticketsRoutes } from "@/features/tickets"` resuelve;
  el placeholder compila; `npm run build` y `npm run lint` pasan.
  (Todavía no navegable — eso es F5.)

### F5 — Montaje de las rutas de tickets en el router raíz

**Editar** `src/routes/routes.jsx`:
- Importar `ticketsRoutes` desde `@/features/tickets`.
- Insertar la(s) ruta(s) como hijas de `MainLayout` (dentro de `AuthGuard`),
  envueltas en `GroupsGuard` siguiendo la convención existente.

- **Dependencias:** F4 (las rutas existen) y F3 (los guards viven en `shared/auth`).
- **Notas:** no se añade enlace en `Sidebar`/`Navbar` (tocaría layout legacy;
  queda como sub-paso opcional fuera del núcleo estructural).
- **Hecho cuando:** navegar a `/tickets` renderiza el placeholder dentro de
  `MainLayout` + `AuthGuard`; las rutas de fichas siguen intactas;
  `npm run build` y `npm run lint` pasan.

### F6 — Documentar la convención feature-based

**Crear** `src/features/README.md` describiendo:
- Propósito de `shared/` vs `features/` y la regla `shared → features`.
- Segmentos estándar de un feature (`api/`, `components/`, `hooks/`, `store/`,
  `pages/`, `schemas/`, `constants/`, `routes.jsx`, `index.js`).
- Frontera pública vía `index.js` (no importar internos de otro feature).
- Regla "colocar primero, extraer después".
- Nota de que los dominios legacy se migrarán uno a uno más adelante, replicando `tickets`.

- **Dependencias:** ninguna.
- **Hecho cuando:** el documento existe y está revisado.

---

## Resumen de dependencias

| Feature | Depende de | Commit independiente |
|---------|-----------|----------------------|
| F1 shared/ui    | —        | ✅ |
| F2 shared/api   | —        | ✅ |
| F3 shared/auth  | —        | ✅ |
| F4 tickets scaffold | F1  | ✅ |
| F5 rutas tickets    | F4, F3 | ✅ |
| F6 docs         | —        | ✅ |

## Criterio de "hecho" global

- `npm run build` y `npm run lint` pasan tras cada feature.
- Cero referencias a las rutas antiguas movidas (`components/ui`, `./axiosService`,
  `./AuthGuard`, `./GroupsGuard`).
- La app arranca (`npm run dev`) y todas las rutas legacy funcionan igual que antes.
- `/tickets` renderiza el placeholder.
- Ningún cambio de comportamiento ni de UI en los dominios existentes.

## Notas de ejecución

- Los commits los hace el usuario manualmente tras revisar cada feature.
- Usar `git mv` en F1–F3 para conservar el historial de los archivos movidos.
- No se modifica `vite.config.js` ni `jsconfig.json` (el alias `@` ya cubre `shared/` y `features/`).
