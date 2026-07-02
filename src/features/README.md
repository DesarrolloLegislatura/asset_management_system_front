# Estructura feature-based

Este directorio contiene los módulos de negocio organizados por *feature*
(funcionalidad), en convivencia con la estructura legacy del proyecto
(`src/components`, `src/api`, `src/store`, etc.).

## `shared/` vs `features/`

- **`src/shared/`** es la capa transversal: design system (`shared/ui`),
  cliente HTTP base (`shared/api`) y protección de rutas (`shared/auth`).
  No contiene lógica de negocio de ningún dominio.
- **`src/features/<feature>/`** contiene la lógica y UI propias de un
  dominio de negocio (p. ej. `tickets`).

**Regla de dependencias:** `shared → features`. `shared` nunca importa de
`features`. Los features tampoco se importan entre sí salvo a través de su
`index.js` (ver más abajo).

## Segmentos estándar de un feature

Un feature puede incluir, según lo que necesite:

- `api/` — llamadas HTTP propias del dominio.
- `components/` — componentes de UI internos del feature.
- `hooks/` — hooks de React propios del dominio.
- `store/` — estado (Zustand) propio del dominio.
- `pages/` — componentes de página, montados desde `routes.tsx`.
- `schemas/` — validaciones (Zod) del dominio.
- `constants/` — constantes propias del dominio.
- `types/` — tipos de dominio propios del feature.
- `routes.tsx` — sub-rutas del módulo, consumidas por el router raíz.
- `index.ts` — API pública del feature.

No todos los segmentos son obligatorios: solo se crean los que el feature
realmente necesita.

## Frontera pública vía `index.ts`

Todo lo que un feature expone hacia el resto de la app pasa por su
`index.ts` (p. ej. `export { ticketsRoutes } from "./routes"`). Otro
módulo (incluido otro feature) no debe importar archivos internos de un
feature directamente (`@/features/tickets/pages/TicketsPage` desde afuera
está prohibido); debe importar desde `@/features/tickets`.

## TypeScript en features nuevos

Los features nuevos (p. ej. `tickets`) se escriben **completos en
`.ts/.tsx`**. El legacy (`src/components`, `src/api`, `src/store`, etc.) y
`shared/` permanecen en `.js/.jsx`; su borde hacia TS se tipa con `.d.ts`
de acompañamiento co-locados (ver `src/plan/migracion-incremental-typescript.md`).

Convenciones para el código nuevo en TS/TSX (React 19):

- No usar `React.FC`; tipar props con `interface`/`type` propios.
- `ref` como prop normal (React 19 no necesita `forwardRef`).
- Usar `JSX.Element` importado de `"react"` (`import type { JSX } from "react"`),
  no el global `JSX` (deprecado en `@types/react` 19).
- `import type` para imports solo-tipo (lo exige `verbatimModuleSyntax` del
  `tsconfig.json`).
- Si `index.ts` re-exporta tipos, usar `export type`.

## Colocar primero, extraer después

Ante la duda de si algo es "compartido", empieza colocándolo dentro del
feature que lo necesita. Solo se mueve a `shared/` cuando un segundo
feature (o un dominio legacy) realmente lo necesita reutilizar.

## Migración de dominios legacy

**Completada** (ver `src/plan/migracion-legacy-feature-based.md`):

- Los dominios de negocio viven en `src/features/`: `fichas` (ingreso,
  técnica, servicio, detail, list, print), `inventario` y `tickets`.
- `shared/` se amplió con la infra transversal: `theme/` (contexto y hooks
  de tema), `layouts/` (AuthLayout, MainLayout, Navbar, Sidebar), `pages/`
  (páginas de estado/error), `lib/` (`cn()`, navegación) y `auth/` completo
  (store, jwt, authz, permissions, hooks, servicio y LoginForm).
- Ya no existen `src/components/`, `src/api/`, `src/hooks/`, `src/store/`,
  `src/utils/`, `src/lib/`, `src/constants/`, `src/contexts/`, `src/data/`
  ni `src/layouts/`.

**Excepción a "features nuevos en TS"**: `fichas` e `inventario` se
migraron de forma mecánica (mover + actualizar imports) y permanecen en
`.js/.jsx`, salvo sus fronteras (`routes.tsx`/`index.ts`). Su conversión a
TypeScript es trabajo futuro, archivo a archivo.
