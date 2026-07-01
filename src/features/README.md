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
- `pages/` — componentes de página, montados desde `routes.jsx`.
- `schemas/` — validaciones (Zod) del dominio.
- `constants/` — constantes propias del dominio.
- `routes.jsx` — sub-rutas del módulo, consumidas por el router raíz.
- `index.js` — API pública del feature.

No todos los segmentos son obligatorios: solo se crean los que el feature
realmente necesita.

## Frontera pública vía `index.js`

Todo lo que un feature expone hacia el resto de la app pasa por su
`index.js` (p. ej. `export { ticketsRoutes } from "./routes"`). Otro
módulo (incluido otro feature) no debe importar archivos internos de un
feature directamente (`@/features/tickets/pages/TicketsPage` desde afuera
está prohibido); debe importar desde `@/features/tickets`.

## Colocar primero, extraer después

Ante la duda de si algo es "compartido", empieza colocándolo dentro del
feature que lo necesita. Solo se mueve a `shared/` cuando un segundo
feature (o un dominio legacy) realmente lo necesita reutilizar.

## Migración de dominios legacy

Los dominios legacy (`FichaTecnica`, `FichaIngreso`, `FichaServicio`,
`Iventario`, etc., hoy bajo `src/components/`, `src/api/`, `src/store/`)
no se migran en bloque. Se migrarán uno a uno en el futuro, replicando el
mismo andamiaje usado en `tickets` (F4/F5 de
`src/plan/new-folder-structure.md`).
