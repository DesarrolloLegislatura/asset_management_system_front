# Plan: tipado e integración de `ticket` / `ticket_status` con openapi-typescript

> Rama de trabajo: `openapi-typescript-inplement`. Solo planificación — cada feature es una
> unidad de trabajo independiente y commiteable, a ejecutar manualmente.

## Contexto y decisiones tomadas

**Hallazgo clave:** en esta rama **no existen** los endpoints `/ticket/*` en los swagger
comprometidos (`swagger.json` 2.0 / `swagger-v3.json` 3.0.0), y el directorio
`src/shared/api/generated/ticket/` referido en el pedido solo existe en las ramas
`implementeOrval` / `ticket-Orbal` (commit `9a0e5cc`): es **código generado por Orval**
(cliente react-query), no una spec. La spec real con tickets es el `swagger-v3.json`
actualizado de ese commit, que expone:

| Recurso | Rutas | Schema principal |
|---|---|---|
| Ticket | `/ticket/ticket/`, `/ticket/ticket/{id}/` | `ExternalTickets` |
| Estado de ticket | `/ticket/ticket_status/`, `/ticket/ticket_status/{id}/` | `TicketStatuses` |
| Catálogos relacionados | `priority`, `service_type`, `task_category`, `provider_company`, `tracking_history`, `additional_request` | `Priorities`, `ServiceTypes`, … |

Las respuestas de listado son **arrays planos** (sin envelope de paginación DRF).
Los `operationId` siguen el patrón `ticket_ticket_list`, `ticket_ticket_status_create`, etc.

**Decisiones acordadas:**

1. **Fuente de la spec:** se descarga **fresca del backend** (no se cherry-pickea de la rama Orval).
2. **Cliente HTTP:** `openapi-typescript` genera **solo tipos**; el consumo sigue el patrón del
   proyecto — servicios Axios sobre `src/shared/api/axiosService.js` (interceptores JWT ya resueltos).
3. **Estado de servidor:** se introduce **TanStack Query** (`@tanstack/react-query`).
4. **Alcance:** **solo capa de datos** (tipos + servicios + hooks) para `ticket` y `ticket_status`.
   La UI de `TicketsPage` queda para un plan posterior.

**Convenciones que aplican a todo el plan** (de `CLAUDE.md` / `src/plan/migracion-incremental-typescript.md`):
todo archivo nuevo en `.ts`; `import type` obligatorio para tipos (`verbatimModuleSyntax`);
sin `React.FC`; `@ts-expect-error` en lugar de `@ts-ignore`; `src/types/api.d.ts` nunca se
edita a mano; `pnpm run build` (`tsc --noEmit` + vite) es la única puerta de verificación.

---

## Feature 1 — Actualizar la spec y regenerar `src/types/api.d.ts` con script reproducible

Hoy `api.d.ts` se regeneró manualmente y `package.json` no tiene ni la dependencia ni un
script (la automatización figura como pendiente en `migracion-incremental-typescript.md` §"Próximos pasos").
Esta feature deja el pipeline reproducible y trae los endpoints `/ticket/*`.

### Generación / Configuración

```bash
# 1. Descargar la spec fresca del backend (ajustar host; drf-yasg suele exponer ambas):
curl -s http://localhost:9002/swagger.json -o swagger.json
#    (alternativa habitual: http://localhost:9002/swagger/?format=openapi)

# 2. Si el backend entrega OpenAPI 2.0 (como el swagger.json actual), convertir a 3.0
#    — openapi-typescript NO soporta 2.0:
npx swagger2openapi swagger.json -o swagger-v3.json

# 3. Instalar el generador pineado y crear el script:
pnpm add -D openapi-typescript
```

En `package.json` → `scripts`:

```json
"generate:api": "openapi-typescript swagger-v3.json -o src/types/api.d.ts"
```

```bash
# 4. Regenerar tipos:
pnpm run generate:api
```

### Archivos

- **Modificar:** `swagger.json` (spec 2.0 fresca del backend — se mantiene comprometida, como hasta ahora).
- **Modificar:** `swagger-v3.json` (conversión 3.0 — fuente del generador).
- **Modificar (autogenerado):** `src/types/api.d.ts` — no editar a mano.
- **Modificar:** `package.json` (+`openapi-typescript` en `devDependencies`, +script `generate:api`) y `pnpm-lock.yaml`.
- **Modificar (opcional):** `CLAUDE.md` / `AGENTS.md` — documentar `pnpm run generate:api`.

### Dependencias

- Backend accesible con la app de tickets desplegada (verificar que la spec descargada
  contiene `/ticket/ticket/` y `/ticket/ticket_status/`; si no, el backend no está actualizado — detenerse aquí).
- Ninguna dependencia con otras features del plan.

### Criterio de aceptación (DoD)

- [ ] `pnpm run generate:api` regenera `src/types/api.d.ts` de forma determinista.
- [ ] `api.d.ts` contiene `"/ticket/ticket/"`, `"/ticket/ticket_status/"` en `paths` y
      `ExternalTickets` / `TicketStatuses` en `components["schemas"]`.
- [ ] Los endpoints preexistentes (`/tds/*`, `/documents/*`, `/auth/*`) siguen presentes
      (la spec nueva es un superset; comparar con `git diff swagger-v3.json`).
- [ ] `pnpm run build` pasa sin errores (nada existente consume aún los tipos nuevos).

Commit sugerido: `feat(api): actualizar swagger con endpoints de tickets y script generate:api`

---

## Feature 2 — Infraestructura TanStack Query

Provider global en la capa `shared` (no importa nada de `features`, respeta la dependency rule).

### Generación / Configuración

```bash
pnpm add @tanstack/react-query
pnpm add -D @tanstack/react-query-devtools   # opcional, solo dev
```

### Archivos

- **Crear:** `src/shared/api/queryClient.ts`

  ```ts
  import { QueryClient } from "@tanstack/react-query";

  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
  ```

- **Modificar:** `src/App.jsx` — envolver `RouterProvider` (se mantiene `.jsx`, es código legacy):

  ```jsx
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ThemeProvider>
  ```

- **Modificar:** `package.json` / `pnpm-lock.yaml`.

### Dependencias

- Independiente de la Feature 1 (puede hacerse en paralelo o en cualquier orden).

### Criterio de aceptación (DoD)

- [ ] La app levanta (`pnpm run dev`) y navega igual que antes; login/refresh JWT intactos.
- [ ] `pnpm run build` pasa.
- [ ] Ningún feature importa aún `useQuery` (solo infraestructura montada).

Commit sugerido: `feat(shared): agregar TanStack Query con QueryClientProvider global`

---

## Feature 3 — Capa de datos `ticket_status`

Primer consumidor real de los tipos generados. Se empieza por `ticket_status` por ser el
recurso simple (catálogo plano) y valida el patrón completo tipos → servicio → hooks.

### Generación / Configuración

Sin generación nueva: consume `src/types/api.d.ts` de la Feature 1. Patrón de tipado:

```ts
// Los tipos derivan SIEMPRE del contrato generado, nunca se declaran a mano:
import type { components, operations } from "@/types/api";

export type TicketStatus = components["schemas"]["TicketStatuses"];
export type TicketStatusInput =
  operations["ticket_ticket_status_create"]["requestBody"]["content"]["application/json"];
```

### Archivos

- **Crear:** `src/features/tickets/types/index.ts` — aliases `TicketStatus`, `TicketStatusInput`
  (y en Feature 4 se amplía con `Ticket`/`TicketInput`). Borrar `types/.gitkeep`.
- **Crear:** `src/features/tickets/constants/queryKeys.ts` — claves centralizadas
  (`ticketKeys.statuses()`, `ticketKeys.status(id)`, y en F4 `ticketKeys.lists()`, `ticketKeys.detail(id)`).
  Borrar `constants/.gitkeep`.
- **Crear:** `src/features/tickets/api/ticketStatusService.ts` — servicio Axios tipado
  (mismo patrón que `fichas/api/statusService.js`, pero TS):

  ```ts
  import axiosService from "@/shared/api/axiosService";
  import type { TicketStatus, TicketStatusInput } from "../types";

  export const ticketStatusService = {
    getAll: async (): Promise<TicketStatus[]> => {
      const { data } = await axiosService.get<TicketStatus[]>("/ticket/ticket_status/");
      return data;
    },
    getById: async (id: number): Promise<TicketStatus> => {
      const { data } = await axiosService.get<TicketStatus>(`/ticket/ticket_status/${id}/`);
      return data;
    },
    create: async (body: TicketStatusInput): Promise<TicketStatus> => { /* POST */ },
    update: async (id: number, body: TicketStatusInput): Promise<TicketStatus> => { /* PUT */ },
    remove: async (id: number): Promise<void> => { /* DELETE */ },
  };
  ```

  Borrar `api/.gitkeep`.
- **Crear:** `src/features/tickets/hooks/useTicketStatuses.ts` — hooks TanStack Query:
  `useTicketStatuses()` (lista), `useTicketStatus(id)` (detalle, `enabled: !!id`),
  `useCreateTicketStatus()` / `useUpdateTicketStatus()` / `useDeleteTicketStatus()`
  (mutations con `invalidateQueries(ticketKeys.statuses())`). Borrar `hooks/.gitkeep`.
- **Modificar:** `src/features/tickets/index.ts` — exportar hooks y tipos públicos
  (`export * from "./hooks/useTicketStatuses"; export type { TicketStatus } from "./types";`).

### Dependencias

- Requiere **Feature 1** (tipos generados) y **Feature 2** (QueryClientProvider).
- Usa `src/shared/api/axiosService` vía su `.d.ts` existente — no tocar `shared`.

### Criterio de aceptación (DoD)

- [ ] `pnpm run build` pasa; cero `any` implícitos y cero `@ts-expect-error` en los archivos nuevos.
- [ ] Verificación manual (consola de dev o componente descartable): `useTicketStatuses()`
      devuelve los estados reales del backend con la sesión JWT actual.
- [ ] `index.ts` de la feature expone la API pública; no se importan archivos internos desde fuera.
- [ ] No quedan `.gitkeep` en segmentos que ya tienen archivos.

Commit sugerido: `feat(tickets): capa de datos tipada para ticket_status`

---

## Feature 4 — Capa de datos `ticket`

Replica el patrón validado en la Feature 3 sobre el recurso principal (`ExternalTickets`).

### Generación / Configuración

Sin generación nueva. Tipos derivados:

```ts
export type Ticket = components["schemas"]["ExternalTickets"];
export type TicketInput =
  operations["ticket_ticket_create"]["requestBody"]["content"]["application/json"];
// Si el GET de lista define query params en la spec, tiparlos desde:
// operations["ticket_ticket_list"]["parameters"]["query"]
```

### Archivos

- **Modificar:** `src/features/tickets/types/index.ts` — añadir `Ticket`, `TicketInput`
  y aliases de solo-lectura para los catálogos referenciados por FK
  (`Priority = components["schemas"]["Priorities"]`, `ServiceType`, `TaskCategory`,
  `ProviderCompany`) — **solo tipos**, sin servicios ni hooks de catálogos (fuera de alcance).
- **Modificar:** `src/features/tickets/constants/queryKeys.ts` — añadir claves de tickets.
- **Crear:** `src/features/tickets/api/ticketService.ts` — CRUD tipado sobre
  `/ticket/ticket/` y `/ticket/ticket/{id}/` (incluir `patch` para cambio parcial de estado:
  `changeStatus: (id, global_status) => axiosService.patch(...)`).
- **Crear:** `src/features/tickets/hooks/useTickets.ts` — `useTickets()`, `useTicket(id)`,
  `useCreateTicket()`, `useUpdateTicket()`, `useChangeTicketStatus()`, `useDeleteTicket()`;
  las mutations invalidan `ticketKeys.lists()` y `ticketKeys.detail(id)`.
- **Modificar:** `src/features/tickets/index.ts` — exportar la nueva API pública.

### Dependencias

- Requiere **Feature 1**, **Feature 2** y comparte `types/` + `queryKeys` con la **Feature 3**
  (ejecutar después de F3 para no duplicar estructura).
- El campo `global_status` de `Ticket` referencia ids de `TicketStatus` (F3) — la relación
  queda documentada en los tipos, la resolución visual (mostrar nombre del estado) es de la fase UI.

### Criterio de aceptación (DoD)

- [ ] `pnpm run build` pasa.
- [ ] Verificación manual contra el backend: listar tickets y hacer un `patch` de estado
      funciona con la sesión actual (probar con datos de desarrollo, no producción).
- [ ] Los tipos de request/response provienen al 100 % de `api.d.ts` (ningún shape duplicado a mano).

Commit sugerido: `feat(tickets): capa de datos tipada para ticket con cambio de estado`

---

## Fuera de alcance (plan posterior)

- UI de `TicketsPage` (lista, detalle, formularios con Zod + react-hook-form) — hoy queda el placeholder.
- Servicios/hooks de catálogos (`priority`, `service_type`, `task_category`, `provider_company`),
  `tracking_history` y `additional_request`.
- Permisos RBAC específicos de tickets en `guards`/`permissions` (la ruta `tickets` hoy no tiene `loader: protect(...)`).
- Migrar `fichas`/`inventario` a los tipos generados o a TanStack Query.

## Orden recomendado y verificación global

```
F1 (spec + tipos) ──┬──> F3 (ticket_status) ──> F4 (ticket)
F2 (TanStack Query) ┘
```

Tras cada feature: `pnpm run build` (única puerta de verificación del repo — no hay tests ni
script de lint; opcionalmente `npx eslint src` manual). Commits en Conventional Commits, uno por feature.
