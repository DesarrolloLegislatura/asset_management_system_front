# Plan: UI CRUD de tickets + catálogos, historial y ABM de estados

> Rama: `openapi-typescript-inplement`. Continúa el plan
> `tipado-endpoints-ticket-openapi-typescript.md` (Features 1–4 ya commiteadas) y el RBAC
> de tickets ya implementado. Solo planificación: los commits los hace el usuario tras revisar cada feature.

## Contexto

**Ya existe (no repetir):**

- Tipos generados en `src/types/api.d.ts` (`pnpm run generate:api`); aliases en
  `src/features/tickets/types/index.ts` (`Ticket`, `TicketInput`, `TicketStatus`,
  `TicketStatusInput`, `Priority`, `ServiceType`, `TaskCategory`, `ProviderCompany`).
- Servicios Axios tipados: `ticketService.ts` (CRUD + `changeStatus`), `ticketStatusService.ts` (CRUD).
- Hooks TanStack Query: `useTickets.ts` (6 hooks), `useTicketStatuses.ts` (5 hooks); `queryClient` global en `App.jsx`.
- RBAC (**pendiente de commit** — prerrequisito de este plan): permisos `ticket.view/create/edit/delete`
  y `ticket_status.manage` en `src/shared/auth/permissions.js`; ruta `/tickets` gateada con
  `protect(PERMISSIONS.TICKET_VIEW)`. Tecnico y Administrador acceden; Administrativo no.

**Alcance acordado:** CRUD completo de tickets · catálogos FK solo lectura ·
`tracking_history` (lectura) + `additional_request` (CRUD) en el detalle · ABM de `ticket_status`.

**Nuance del modelo (condiciona el orden):** `TrackingHistory.additional_request` es la FK
obligatoria — el historial pertenece a los *pedidos adicionales*, no al ticket. Por eso la
Feature 6 (additional_request) precede a la Feature 7 (tracking_history).

**Limitación del backend a tener presente:** los endpoints de listado devuelven arrays planos,
sin paginación ni query params de filtro. Todo filtrado (incluido "additional_requests de un
ticket") es client-side. Si el backend agrega filtros, ajustar los servicios en ese momento.

**Convenciones:** todo archivo nuevo en `.tsx`/`.ts` estricto; componentes shadcn de
`@/shared/ui/`; tabla con `@tanstack/react-table` (patrón `FichaList`); formularios con
`react-hook-form` + Zod (`@hookform/resolvers`, patrón `FichaIngresoForm`); UI en español;
gating visual con `usePermissions()` + rutas con `protect()`. Verificación por feature:
`pnpm run build`.

## Mapa de rutas final

| Ruta | Permiso (loader) | Feature |
|---|---|---|
| `/tickets` | `ticket.view` | F2 |
| `/tickets/detail/:id` | `ticket.view` | F3 |
| `/tickets/new` | `ticket.create` | F4 |
| `/tickets/edit/:id` | `ticket.edit` | F4 |
| `/tickets/estados` | `ticket_status.manage` | F5 |

---

## Feature 1 — Capa de datos de catálogos (solo lectura)

Los selects del formulario y la resolución de nombres FK necesitan `priority`,
`service_type`, `task_category` y `provider_company`. Solo `getAll` — el ABM de catálogos
se hace desde el admin del backend.

### Archivos

- **Crear** `src/features/tickets/api/catalogService.ts` — un objeto con `getPriorities`,
  `getServiceTypes`, `getTaskCategories`, `getProviderCompanies` (GET tipados con los aliases existentes).
- **Crear** `src/features/tickets/hooks/useCatalogs.ts` — `usePriorities()`, `useServiceTypes()`,
  `useTaskCategories()`, `useProviderCompanies()`; `staleTime` largo (p. ej. 5 min): son datos casi estáticos.
- **Modificar** `src/features/tickets/constants/queryKeys.ts` — `ticketKeys.catalog(name)`.
- **Modificar** `src/features/tickets/index.ts` — exportar los hooks nuevos.

### Dependencias

- Prerrequisito global: commit del RBAC pendiente. Ninguna otra.

### Criterio de hecho

- [ ] `pnpm run build` pasa.
- [ ] Los 4 hooks devuelven datos reales del backend (verificación manual).
- [ ] Cero shapes a mano: todo tipado desde los aliases de `types/index.ts`.

Commit sugerido: `feat(tickets): capa de datos de catálogos de solo lectura`

---

## Feature 2 — Lista de tickets + navegación

`TicketsPage` deja de ser placeholder. Patrón `FichaList` (tabla TanStack + filtros client-side).

### Archivos

- **Crear** `src/features/tickets/components/TicketList/TicketList.tsx` — orquestador: `useTickets()`,
  `useTicketStatuses()` (badge de estado por nombre), `usePriorities()`; estado de tabla
  (sorting, filtros); botón "Nuevo ticket" gateado con `hasPermission(TICKET_CREATE)`.
- **Crear** `.../TicketList/TicketListTable.tsx` — presentacional (columnas: nº externo, título,
  estado, prioridad, empresa, fecha apertura; acciones Ver/Editar gateadas).
- **Crear** `.../TicketList/TicketListFilter.tsx` — búsqueda global + filtro por estado.
- **Crear** `.../TicketList/TicketListPaginate.tsx` — paginación client-side (patrón `FichaListPaginate`).
- **Modificar** `src/features/tickets/pages/TicketsPage.tsx` — renderiza `TicketList`.
- **Modificar** `src/shared/lib/navigation.js` — item "Tickets" (`href: "/tickets"`,
  `permission: PERMISSIONS.TICKET_VIEW`, ícono lucide p. ej. `Ticket`). Sigue en `.js` (shared legacy).
- **Borrar** `src/features/tickets/components/.gitkeep`.

### Dependencias

- **F1** (catálogos para columnas de prioridad/empresa). Usa hooks/tipos ya commiteados.

### Criterio de hecho

- [ ] `/tickets` lista tickets reales con badges de estado resueltos por nombre.
- [ ] El item "Tickets" aparece en el sidebar solo para Tecnico/Administrador (verificar con Administrativo que NO).
- [ ] Ordenamiento, búsqueda y paginación funcionan client-side.
- [ ] `pnpm run build` pasa.

Commit sugerido: `feat(tickets): lista de tickets con filtros y entrada de navegación`

---

## Feature 3 — Detalle de ticket

Patrón `FichaDetail` (tabs). Deja las tabs de historial/pedidos preparadas pero se completan en F6/F7.

### Archivos

- **Crear** `src/features/tickets/components/TicketDetail/TicketDetail.tsx` — carga con
  `useTicket(id)` (param de ruta), header con título/estado, tabs.
- **Crear** `.../TicketDetail/TicketTabInfo.tsx` — datos generales + FKs resueltas a nombres
  (estado, prioridad, tipo de servicio, categoría, empresa) vía hooks de F1; link externo
  `direct_ticket_url` si existe.
- **Modificar** `src/features/tickets/routes.tsx` — ruta `tickets/detail/:id` con `protect(PERMISSIONS.TICKET_VIEW)`.

### Dependencias

- **F1** (resolución de nombres FK) y **F2** (navegación desde la lista).

### Criterio de hecho

- [ ] Desde la lista, "Ver" abre el detalle con todos los campos y FKs resueltas a nombres.
- [ ] `id` inexistente muestra estado de error limpio (no crash).
- [ ] `pnpm run build` pasa.

Commit sugerido: `feat(tickets): vista de detalle de ticket`

---

## Feature 4 — Formulario alta/edición, cambio de estado y baja

Cierra el CRUD de tickets usando las mutations ya implementadas.

### Archivos

- **Crear** `src/features/tickets/schemas/ticketSchema.ts` — schema Zod alineado a `TicketInput`
  (`general_title` y `company` obligatorios según la spec; fechas como string ISO; FKs numéricas
  nullable). Tipar el form con `z.infer` y verificar compatibilidad con `TicketInput`.
  Borrar `schemas/.gitkeep`.
- **Crear** `src/features/tickets/components/TicketForm/TicketForm.tsx` — alta y edición en un
  componente (patrón `FichaIngresoForm`): `useForm` + `zodResolver`, selects poblados con
  hooks de F1 + `useTicketStatuses()`, submit con `useCreateTicket()`/`useUpdateTicket()`,
  redirección al detalle al guardar.
- **Crear** `src/features/tickets/components/TicketDetail/TicketStatusDialog.tsx` — diálogo de
  cambio de estado (select de `TicketStatus` + `useChangeTicketStatus()`), visible con
  `hasPermission(TICKET_EDIT)`; se monta en `TicketDetail` y opcionalmente como acción de fila en la lista.
- **Modificar** `TicketDetail.tsx` / `TicketList.tsx` — acciones Editar (`TICKET_EDIT`),
  Eliminar con diálogo de confirmación (`TICKET_DELETE`, `useDeleteTicket()`).
- **Modificar** `src/features/tickets/routes.tsx` — `tickets/new` (`protect(TICKET_CREATE)`) y
  `tickets/edit/:id` (`protect(TICKET_EDIT)`).

### Dependencias

- **F1** (selects), **F2** (punto de entrada "Nuevo ticket"), **F3** (redirección post-submit y acciones en detalle).

### Criterio de hecho

- [ ] Crear, editar, cambiar estado y eliminar un ticket funciona end-to-end contra el backend
      de desarrollo; la lista/detalle se actualizan sin recargar (invalidación de cache ya implementada).
- [ ] Validaciones Zod visibles en el form (obligatorios, tipos).
- [ ] Rutas `new`/`edit` inaccesibles sin el permiso correspondiente (redirect a `/unauthorized`).
- [ ] `pnpm run build` pasa.

Commit sugerido: `feat(tickets): formularios de alta/edición, cambio de estado y baja`

---

## Feature 5 — ABM de estados de ticket (`ticket_status`)

Pantalla de administración gateada con `ticket_status.manage`. Usa las mutations de
`useTicketStatuses.ts` ya commiteadas (hasta ahora sin consumidor de escritura).

### Archivos

- **Crear** `src/features/tickets/pages/TicketStatusAdminPage.tsx` — tabla simple de estados
  (code, name, description, active) + acciones.
- **Crear** `src/features/tickets/components/TicketStatusAdmin/TicketStatusFormDialog.tsx` —
  diálogo alta/edición con Zod (`code` y `name` obligatorios) + `useCreateTicketStatus()`/`useUpdateTicketStatus()`;
  eliminación con confirmación (`useDeleteTicketStatus()`).
- **Crear** `src/features/tickets/schemas/ticketStatusSchema.ts`.
- **Modificar** `src/features/tickets/routes.tsx` — `tickets/estados` con `protect(PERMISSIONS.TICKET_STATUS_MANAGE)`.
- **Modificar** `src/shared/lib/navigation.js` — child "Estados" bajo el item Tickets con
  `permission: PERMISSIONS.TICKET_STATUS_MANAGE`.

### Dependencias

- **F2** (item de navegación padre). Independiente de F3/F4.

### Criterio de hecho

- [ ] CRUD de estados end-to-end; los selects de estado del resto de la feature reflejan los
      cambios (invalidación de `ticketKeys.statuses()`).
- [ ] Ruta y entrada de menú invisibles/inaccesibles sin `ticket_status.manage`.
- [ ] `pnpm run build` pasa.

Commit sugerido: `feat(tickets): ABM de estados de ticket`

---

## Feature 6 — Pedidos adicionales (`additional_request`): datos + CRUD en el detalle

### Archivos

- **Modificar** `src/features/tickets/types/index.ts` — `AdditionalRequest`
  (`components["schemas"]["AdditionalRequests"]`) y `AdditionalRequestInput`
  (Omit de `id`/`createdat`/`updatedat`).
- **Modificar** `src/features/tickets/constants/queryKeys.ts` —
  `ticketKeys.additionalRequests(ticketId)`.
- **Crear** `src/features/tickets/api/additionalRequestService.ts` — CRUD sobre
  `/ticket/additional_request/`; `getByTicket(ticketId)` = `getAll()` + filtro client-side por
  `parent_ticket` (sin query params en el backend — dejar comentario señalándolo).
- **Crear** `src/features/tickets/hooks/useAdditionalRequests.ts` — query por ticket + mutations
  (create/update/delete) invalidando `ticketKeys.additionalRequests(ticketId)`.
- **Crear** `src/features/tickets/schemas/additionalRequestSchema.ts` — Zod
  (`sequence`, `request_description`, `parent_ticket` obligatorios).
- **Crear** `src/features/tickets/components/TicketDetail/TicketTabAdditionalRequests.tsx` —
  tab en el detalle: lista de pedidos del ticket + alta/edición en diálogo + baja con confirmación;
  escritura gateada con `hasPermission(TICKET_EDIT)`.
- **Modificar** `TicketDetail.tsx` — montar la tab.
- **Modificar** `src/features/tickets/index.ts` — exportar hooks/tipos nuevos.

### Dependencias

- **F3** (el detalle es el host de la tab), **F1** (select de prioridad del pedido),
  estados de `useTicketStatuses()` para `request_status`.

### Criterio de hecho

- [ ] Desde el detalle de un ticket: listar, crear, editar y eliminar pedidos adicionales end-to-end.
- [ ] Solo se muestran los pedidos del ticket abierto (filtro por `parent_ticket`).
- [ ] `pnpm run build` pasa.

Commit sugerido: `feat(tickets): CRUD de pedidos adicionales en el detalle de ticket`

---

## Feature 7 — Historial (`tracking_history`, solo lectura)

El historial cuelga de cada pedido adicional (FK `additional_request`), no del ticket:
la UI lo muestra dentro de la tab de pedidos (expandible por pedido) o como tab "Historial"
que agrupa por pedido — decidir en implementación según lo que rinda mejor visualmente.

### Archivos

- **Modificar** `src/features/tickets/types/index.ts` — `TrackingHistoryEntry`
  (`components["schemas"]["TrackingHistory"]`).
- **Modificar** `queryKeys.ts` — `ticketKeys.trackingHistory(additionalRequestId)`.
- **Crear** `src/features/tickets/api/trackingHistoryService.ts` — solo `getAll` + filtro
  client-side por `additional_request` (misma limitación del backend que F6).
- **Crear** `src/features/tickets/hooks/useTrackingHistory.ts` — query de lectura.
- **Crear** `src/features/tickets/components/TicketDetail/TicketTrackingHistory.tsx` —
  timeline de eventos (fecha, estado anterior → nuevo resueltos por nombre vía
  `useTicketStatuses()`, comentario, origen). Patrón visual: `FichaTabEstados`.
- **Modificar** `TicketTabAdditionalRequests.tsx` (o `TicketDetail.tsx`) — montar el historial.
- **Modificar** `src/features/tickets/index.ts` — exportar lo nuevo.

### Dependencias

- **F6** (obligatoria: el historial se consulta por pedido adicional).

### Criterio de hecho

- [ ] El historial de cada pedido adicional se ve con estados resueltos por nombre y orden cronológico.
- [ ] Sin escritura: ningún mutation de tracking_history (lo escribe el backend).
- [ ] `pnpm run build` pasa.

Commit sugerido: `feat(tickets): historial de seguimiento en el detalle de ticket`

---

## Orden y verificación global

```
RBAC (commit pendiente) ──> F1 ──> F2 ──> F3 ──> F4
                                    │      └──> F6 ──> F7
                                    └──> F5 (independiente de F3/F4)
```

- Tras cada feature: `pnpm run build` + prueba manual del flujo contra el backend de desarrollo
  con los tres roles (Tecnico ✓, Administrador ✓, Administrativo ✗).
- Los `.gitkeep` de `components/` y `schemas/` se borran en la primera feature que puebla cada segmento.
- `store/` (Zustand) no se usa: el estado de servidor vive en TanStack Query y el estado de
  tabla/formularios es local. Si al final ninguna feature lo necesitó, borrar `store/.gitkeep` en F7.
