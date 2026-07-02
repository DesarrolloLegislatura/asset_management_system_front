# Plan: Migración incremental a TypeScript (feature piloto `tickets`)

## Contexto

El proyecto (`asset-management-system-front`, v0.8.0) es hoy **100% JavaScript**: React 19.2 +
Vite 6 con SWC (`@vitejs/plugin-react-swc`), pnpm 11 / Node 22, ESLint 9 flat config (solo
`.js/.jsx`), `jsconfig.json` con alias `@ → ./src`. No hay `typescript` instalado, no hay tests
ni Prettier, y `pnpm build` es la única verificación. El único `.ts` existente es
`src/types/api.d.ts` (tipos de la API autogenerados por `openapi-typescript`).

La reestructuración feature-based ya está hecha (rama `new-folder-structure`, ver
`src/plan/new-folder-structure.md`): existe `src/shared/` (`ui/`, `api/axiosService.js`,
`auth/guards.js`) y `src/features/tickets/` con los segmentos estándar (hoy vacíos con
`.gitkeep`, salvo `pages/TicketsPage.jsx`, `routes.jsx`, `index.js`). La convención está en
`src/features/README.md`.

**Necesidad**: habilitar TypeScript de forma **incremental**, para que el código nuevo pueda
escribirse en TS conviviendo con todo el JS existente, **sin migrar código legacy**. `tickets`
—nuevo y aún sin lógica— es el primer caso de uso y se escribe **completo en `.ts/.tsx`**.
El objetivo de este plan es dejar el andamiaje (tsconfig, gate de tipos, lint TS, borde tipado
de `shared/`) listo y validado, con `tickets` como prueba viva.

## Decisiones de diseño (acordadas)

- **Convivencia JS/TS**: `allowJs: true`, `checkJs: false` → el JS legacy se transpila y se
  puede importar desde TS, pero **no** se type-checkea. Solo `.ts/.tsx` (y `.d.ts`) se verifican.
- **Alcance del tipado**: el feature `tickets` (y los futuros features) se escriben **completos
  en `.ts/.tsx`**. El legacy (`src/components`, `src/api`, `src/store`, …) queda en JS.
- **Borde `shared/`**: `shared/` **no se migra**; se le añaden **`.d.ts` de acompañamiento**
  para tipar el límite que consumen los features.
- **Verificación de tipos**: **gate** `tsc --noEmit` en el script `build` (y por ende en el
  deploy, que corre `pnpm run build` dentro del Docker build).

## Convenciones de la migración

- **Nomenclatura**: código **nuevo** de features en `.ts/.tsx`; **legacy y `shared/` quedan en
  `.js/.jsx`**; el borde de `shared/` se tipa con `.d.ts` co-locados.
- **`tsconfig.json` reemplaza a `jsconfig.json`** (TS ignora `jsconfig` cuando existe
  `tsconfig`; se borra para no duplicar config). `vite.config.js` **no se toca**: SWC transpila
  TS/TSX sin config extra y el alias `@` ya está resuelto ahí.
- **Supresiones**: usar `@ts-expect-error` (nunca `@ts-ignore`): falla cuando el error
  subyacente desaparece, así las supresiones no quedan huérfanas.
- `tsconfig.json` propuesto:

  ```jsonc
  {
    "compilerOptions": {
      "target": "ES2022",
      "lib": ["ES2023", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "moduleResolution": "bundler",
      "jsx": "react-jsx",
      "allowJs": true,
      "checkJs": false,
      "strict": true,
      "noEmit": true,
      "isolatedModules": true,
      "verbatimModuleSyntax": true,
      "esModuleInterop": true,
      "resolveJsonModule": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "baseUrl": ".",
      "paths": { "@/*": ["./src/*"] }
    },
    "include": ["src"]
  }
  ```

  Notas: `strict: true` es seguro desde el día uno porque con `checkJs: false` solo afecta al
  código nuevo en TS. `isolatedModules` es requerido por la transpilación per-file de SWC.
  `verbatimModuleSyntax` fuerza `import type` para imports solo-tipo (coherente con SWC y con
  las convenciones React 19 de F5; solo aplica a `.ts/.tsx`, no al legacy).
  `skipLibCheck` evita chequear los `.d.ts` de `node_modules` y el `api.d.ts` autogenerado.

  Verificado sobre el repo: no hay JSX dentro de archivos `.js` ni directivas
  `@ts-check`/`@flow` en el legacy, por lo que el gate global `tsc --noEmit` con `allowJs` no
  puede romper por culpa del código existente.

---

## F1 — Toolchain TypeScript + `tsconfig.json` ✅ COMPLETADO

Fundación: instala TS y hace que el proyecto reconozca `.ts/.tsx` sin romper el JS actual.

- **Archivos/carpetas a crear o mover**
  - `package.json`: añadir a devDependencies (quedan pinneadas por `save-exact=true` en
    `.npmrc`) `typescript` (última estable) y `@types/node` (línea 22, por Node 22 del
    Dockerfile).
  - `package.json`: actualizar `@types/react` y `@types/react-dom` de `19.0.x` a `19.2.x`,
    alineados con `react`/`react-dom` `19.2.1`. Los `.tsx` de F5 se chequean contra estos
    tipos; con 19.0 faltarían/estarían mal las APIs nuevas de React 19.2.
  - Crear `tsconfig.json` en la raíz con el contenido propuesto arriba.
  - Crear `src/vite-env.d.ts` con `/// <reference types="vite/client" />` (tipa
    `import.meta.env`, usado por `axiosService`).
  - **Borrar** `jsconfig.json` (sus `baseUrl`/`paths` migran a `tsconfig.json`).
- **Dependencias con otras features**: ninguna (es la base de todas).
- **Criterio de hecho**
  - `pnpm install` OK; `pnpm build` sigue verde (Vite/SWC intactos).
  - `npx tsc --noEmit` corre **sin errores** sobre el repo actual (el JS legacy no se chequea;
    se verifica que `src/types/api.d.ts` no rompe).
  - El alias `@/*` sigue resolviendo en el editor vía `tsconfig.json`.
- **Nota de ejecución**: TypeScript 6.0 deprecó `baseUrl` como opción standalone
  (`TS5101`). Se quitó del `tsconfig.json`: no hacía falta, `paths` con rutas relativas
  (`./src/*`) se resuelve automáticamente respecto a la ubicación del propio `tsconfig.json`
  desde TS 4.1+. El alias `@/*` sigue funcionando igual.

## F2 — Script `typecheck` + gate de tipos en build ✅ COMPLETADO

Vite/SWC transpilan TS **sin** chequear tipos; sin gate, los errores de tipo nunca se detectan.

- **Archivos/carpetas a crear o mover**
  - `package.json` → `scripts`:
    - `"typecheck": "tsc --noEmit"`
    - `"build": "tsc --noEmit && vite build"` (antepone el gate al build).
  - No se toca ningún workflow de GitHub: el deploy existente construye vía Docker con
    `pnpm run build`, así que el gate queda cubierto ahí automáticamente. El feedback temprano
    de tipos es local: `pnpm run typecheck` antes de commitear cada fase.
- **Dependencias con otras features**: F1 (necesita `typescript` + `tsconfig.json`).
- **Criterio de hecho**
  - `pnpm run typecheck` termina en 0.
  - `pnpm build` ejecuta `tsc --noEmit` antes de `vite build`; un error de tipo introducido a
    propósito hace fallar el build (y luego se revierte).

## F3 — Soporte de TypeScript en ESLint ✅ COMPLETADO

El flat config actual solo matchea `**/*.{js,jsx}`; sin esto, los `.ts/.tsx` quedan sin lint.

- **Archivos/carpetas a crear o mover**
  - `package.json`: añadir devDependency `typescript-eslint` (paquete paraguas: parser +
    plugin, estándar actual para ESLint 9 flat config).
  - `eslint.config.js`: **añadir** un bloque nuevo para `**/*.{ts,tsx}` usando el parser y las
    reglas recomendadas de `typescript-eslint`, reusando los plugins `react`, `react-hooks` y
    `react-refresh` ya instalados. El bloque existente `**/*.{js,jsx}` **no se modifica**.
- **Dependencias con otras features**: F1 (`typescript` instalado).
- **Criterio de hecho**
  - `npx eslint` sobre un `.tsx` del feature `tickets` funciona (parser TS activo, sin falsos
    errores de sintaxis).
  - El lint de los `.js/.jsx` legacy no cambia de comportamiento.
- **Nota de ejecución**: verificado con un `.tsx` de prueba (creado y luego borrado) que
  `@typescript-eslint/no-unused-vars` dispara correctamente sobre TSX. El conteo de problemas
  de `npx eslint .` sobre el repo (280: 276 errores, 4 warnings, todos preexistentes en
  `.js/.jsx`/`vite.config.js`) es idéntico con y sin el bloque `.ts/.tsx` nuevo (comparado con
  `git stash` del `eslint.config.js`), confirmando que el legacy no cambió de comportamiento.

## F4 — Borde tipado de `shared/` vía `.d.ts` de acompañamiento ✅ COMPLETADO

Tipa el límite que los features consumen, **sin** reescribir el JS de `shared/`.

- **Archivos/carpetas a crear o mover**
  - Crear `src/shared/api/axiosService.d.ts`: declara el `export default` como `AxiosInstance`
    (tipos del paquete `axios`, ya dependencia).
  - Crear `src/shared/auth/guards.d.ts`: declara las firmas de `requireAuth`,
    `protect(permission)` y `redirectIfAuthenticated` (loaders de React Router 7).
  - `axiosService.js` y `guards.js` **no se tocan** (con `allowJs`, TS prefiere el `.d.ts`
    co-locado al resolver el import).
  - Nota de mantenimiento: estos `.d.ts` se sincronizan **a mano** con su `.js`; si cambia la
    firma en el `.js`, hay que actualizar el `.d.ts` en el mismo cambio (riesgo de drift
    asumido hasta que `shared/` migre a TS). Dejarlo advertido en un comentario al tope de
    cada `.d.ts`.
- **Dependencias con otras features**: F1.
- **Criterio de hecho**
  - Desde un archivo `.ts`, `import axiosService from "@/shared/api/axiosService"` resuelve a
    `AxiosInstance` tipado; los guards importados exponen sus firmas.
  - `pnpm run typecheck` sigue en 0.
- **Nota de ejecución**: `guards.d.ts` tipa `requireAuth` con el shape real de `user` leído de
  `src/store/authStore.js` (interfaz `AuthUser`: `id`, `username`, `first_name`, `last_name`,
  `token`, `refreshToken`, `groups`, `group`) y `protect`/`redirectIfAuthenticated` como loaders
  de `react-router` (`LoaderFunctionArgs`, ya tipado nativamente por el paquete, sin
  `@types/react-router` adicional). Verificado con un `.ts` de prueba (creado y borrado): los
  tipos resuelven correctamente y un acceso a una propiedad inexistente de `AuthUser` es
  detectado por `tsc` (confirmado quitando un `@ts-expect-error` a propósito y viendo el error
  `TS2339`, luego revertido).

## F5 — Convertir el andamiaje de `tickets` a `.ts/.tsx` ✅ COMPLETADO

`tickets` como primer feature en TypeScript completo: prueba viva de todo el andamiaje.

- **Archivos/carpetas a crear o mover** (usar `git mv` para preservar historial)
  - `src/features/tickets/pages/TicketsPage.jsx` → `TicketsPage.tsx`.
  - `src/features/tickets/routes.jsx` → `routes.tsx`.
  - `src/features/tickets/index.js` → `index.ts`.
  - Añadir segmento `src/features/tickets/types/.gitkeep` (los features en TS tendrán `types/`
    para sus tipos de dominio).
  - Las carpetas de segmento vacías restantes (`api/`, `components/`, `hooks/`, `store/`,
    `constants/`, `schemas/`) se dejan como están, con su `.gitkeep`.
  - `src/routes/routes.jsx` **no cambia**: `import { ticketsRoutes } from "@/features/tickets"`
    sigue resolviendo (ahora a `index.ts`, el import no lleva extensión).
  - `src/features/README.md`: actualizar la lista de segmentos estándar para incluir `types/`
    (y `routes.tsx`/`index.ts`), y documentar que **los features nuevos se escriben en
    `.ts/.tsx`** mientras legacy y `shared/` permanecen en JS (con `.d.ts` de borde).
  - `src/features/README.md`: añadir una sección corta de **convenciones TS/React 19** para
    features nuevos:
    - No usar `React.FC`; tipar props con `interface`/`type` propios.
    - `ref` como prop normal (React 19 no necesita `forwardRef`).
    - Usar el namespace `React.JSX` (el global `JSX` está deprecado en `@types/react` 19).
    - `import type` para imports solo-tipo (lo exige `verbatimModuleSyntax`).
    - Si `index.ts` re-exporta tipos, usar `export type`.
- **Dependencias con otras features**: F1 (obligatoria). Recomendado después de F2 (el gate
  valida los nuevos `.tsx`), F3 (lint TS disponible) y F4 (imports de `shared/` tipados).
- **Criterio de hecho**
  - `pnpm build` verde (incluye el gate `tsc --noEmit`); `pnpm run typecheck` en 0.
  - La ruta `/tickets` renderiza la `TicketsPage` placeholder igual que antes.
  - No queda ningún import roto hacia `@/features/tickets`.
- **Nota de ejecución — adición a F4 descubierta durante F5**: al convertir `TicketsPage.tsx`,
  `tsc` reportó `className` como prop **requerida** en `Card`/`CardHeader`/`CardTitle`/
  `CardContent` (`src/shared/ui/card.jsx`). Es el mismo problema que F4 resolvió para
  `shared/api`/`shared/auth`, pero `shared/ui` no estaba cubierto: sin `.d.ts`, la inferencia
  de TS sobre JS (`allowJs`, `checkJs: false`) trata cada prop desestructurada sin valor por
  defecto como requerida. Se agregó `src/shared/ui/card.d.ts` (mismo patrón de F4: declaración
  de acompañamiento, `card.jsx` sin tocar) tipando los 7 componentes exportados con
  `ComponentProps<"div">`. **Implicación para el futuro**: cualquier feature en TS que consuma
  un componente de `shared/ui` sin `.d.ts` propio pisará el mismo error; se resuelve caso a
  caso, agregando el `.d.ts` correspondiente cuando se lo encuentra (coherente con "colocar
  primero, extraer/tipar después").
- **Nota de ejecución — verificación de `/tickets`**: confirmado con el dev server
  (`pnpm dev`) + `curl`: `GET /tickets` → `200` (shell SPA), y Vite/SWC transforma
  `src/features/tickets/pages/TicketsPage.tsx` sin error de módulo (`200` al pedirlo
  directamente). No se usó un navegador real en esta verificación (decisión tomada con el
  autor del repo, que además ya tenía el dev server abierto en su propio navegador).

---

## Orden sugerido y grafo de dependencias

`F1 → F2 → F3 → F4 → F5`, un commit por feature (los commits los hace el autor del repo
manualmente, tras revisar cada fase).

- F1 es prerequisito de todas.
- F2, F3 y F4 dependen solo de F1 y son intercambiables entre sí.
- F5 va al final, para que el gate (F2), el lint TS (F3) y el borde tipado (F4) ya estén
  activos cuando `tickets` pasa a TS.

### Mensajes de commit sugeridos (estilo conventional commits del repo)

- **F1**: `feat: add TypeScript toolchain and tsconfig`
- **F2**: `feat: gate build on tsc type checking`
- **F3**: `feat: add TypeScript support to ESLint config`
- **F4**: `feat: type shared/ boundary with declaration files`
- **F5**: `refactor: convert tickets feature scaffold to TypeScript`

## Fuera de alcance (explícito)

- Migrar dominios legacy (`FichaTecnica`, `FichaIngreso`, `Iventario`, etc.) o reescribir
  `shared/*.js` a TS.
- Automatizar `openapi-typescript` (regeneración de `src/types/api.d.ts`), Prettier o
  tests/Vitest.
- Adoptar React Server Components: `@vitejs/plugin-rsc` figura en `dependencies` pero no está
  montado en `vite.config.js`; la app es SPA con React Router 7 en data mode. (Evaluar
  remover esa dependencia muerta queda para otra tarea.)
- Cambiar de tooling (Biome, Rsbuild, etc.): se mantiene Vite + `typescript-eslint` para
  minimizar la fricción de la migración.
- Cualquier refactor o mejora de código no listada arriba: alcance estrictamente estructural.

## Verificación end-to-end

1. `pnpm install` (instala `typescript`, `@types/node`, `typescript-eslint`; actualiza
   `@types/react`/`@types/react-dom` a 19.2.x).
2. `pnpm run typecheck` → 0 errores.
3. `pnpm build` → corre el gate `tsc --noEmit` y genera `dist/` sin errores.
4. `pnpm dev` y navegar a `/tickets` → renderiza la página placeholder.
5. Prueba negativa del gate: introducir un error de tipo en `TicketsPage.tsx`, confirmar que
   `pnpm build` **falla**, y revertir.
6. En el editor, confirmar el borde tipado: en un `.ts`, `axiosService` aparece como
   `AxiosInstance` y los guards exponen sus firmas.

## Referencias (buenas prácticas 2026)

- Migración incremental JS→TS (`allowJs`/`checkJs`, `@ts-expect-error`):
  <https://www.iloveblogs.blog/post/typescript-javascript-migration-guide-2026>
- Ajustes de `tsconfig` recomendados:
  <https://blog.webdevsimplified.com/2026-04/advanced-tsconfig-settings/>
- React + TS + Vite, baseline 2026 (`moduleResolution: "bundler"`):
  <https://www.nandann.com/blog/react-typescript-vite-vitest-setup-guide-2026>
- Vite no type-checkea; gate con `tsc --noEmit`:
  <https://github.com/vitejs/vite/discussions/18543>
- Convención de capas (`shared`) en Feature-Sliced Design:
  <https://feature-sliced.design/docs/reference/layers>
