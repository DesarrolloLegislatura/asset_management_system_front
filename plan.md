# Plan: rutas faltantes de la API de tickets

> Rama: `openapi-typescript-inplement` · Fuente de verdad: `src/types/api.d.ts` (48 operaciones `/ticket/*`).
> Archivo de seguimiento: marcar los checkboxes a medida que se completa cada feature.
> Los commits los hace el usuario tras revisar cada feature. `pnpm run build` es la puerta de verificación.

## Estado actual del proyecto (análisis 2026-07-07)

Working tree limpio; todo lo anterior commiteado hasta `0919a4d`. Implementado y funcionando:
tipos generados (`generate:api`), TanStack Query global, RBAC de tickets
(`ticket.view/create/edit/delete`, `ticket_status.manage`), CRUD completo de `ticket` con UI
(lista/detalle/form/estados), ABM de `ticket_status`, pedidos adicionales con CRUD en el
detalle, historial de seguimiento de lectura, catálogos de solo lectura y las 9 declaraciones
`.d.ts` de acompañamiento para los componentes shadcn.

### Matriz de cobertura de operaciones de la API

| Recurso | list | read | create | update | partial_update | delete |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| `ticket` | ✅ | ✅ | ✅ | ✅ | ✅ (`changeStatus`) | ✅ |
| `ticket_status` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| `additional_request` | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| `priority` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `service_type` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `task_category` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `provider_company` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `tracking_history` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

**Faltan 25 operaciones**, agrupadas en: ABM de los 4 catálogos (20), escritura de
`tracking_history` (4: read/create/update/delete — patch se considera cubierto por PUT) y
gaps menores en recursos ya cubiertos (3).

### Decisiones de diseño (confirmadas 2026-07-07)

- **RBAC:** nuevo permiso `ticket_catalog.manage` (patrón de `ticket_status.manage`) para el
  ABM de catálogos, asignado a Tecnico (+ Administrador por el spread). La escritura de
  `tracking_history` se gatea con el permiso existente `ticket.edit` (es parte del flujo del pedido).
- **`partial_update` (PATCH):** solo se implementa donde la UI lo aprovecha (toggle `active`
  de catálogos sin reenviar el objeto completo). Donde PUT ya cubre el caso, no se duplica.
- **`tracking_history`:** el registro de eventos es **manual desde el frontend** (confirmado);
  la Feature 4 se implementa completa (create/update/delete + formulario en el detalle del pedido).

---

## Feature 1 — Capa de datos: CRUD de catálogos + permiso RBAC

- [x] Completada

### Archivos

- **Modificar** `src/features/tickets/types/index.ts` — inputs de escritura:
  `PriorityInput`, `ServiceTypeInput`, `TaskCategoryInput`, `ProviderCompanyInput`
  (Omit de `id`/`createdat`/`updatedat` donde aplique; `ServiceTypes`/`TaskCategories` solo tienen `id`+`name`).
- **Modificar** `src/features/tickets/api/catalogService.ts` — por cada catálogo:
  `getById`, `create`, `update` (PUT), `setActive` (PATCH `{active}`, solo priority/provider_company
  que tienen el campo), `remove`. Mantener los `getAll` existentes.
- **Modificar** `src/features/tickets/hooks/useCatalogs.ts` — mutations por catálogo
  (`useCreatePriority`, `useUpdatePriority`, `useDeletePriority`, ídem los otros 3) invalidando
  `ticketKeys.catalog(<nombre>)`.
- **Modificar** `src/shared/auth/permissions.js` — `TICKET_CATALOG_MANAGE: "ticket_catalog.manage"`
  en `PERMISSIONS` y en el grupo Tecnico.
- **Modificar** `src/features/tickets/index.ts` — exportar hooks/tipos nuevos.

### Dependencias

- Ninguna (base para F2 y F3).

### Criterio de hecho

- [x] `pnpm run build` pasa; tipos 100 % derivados de `api.d.ts`.
- [x] Verificación manual de un `create`+`delete` de prioridad contra el backend de desarrollo.
- [x] Matriz de permisos: Tecnico/Administrador ✓, Administrativo ✗ (verificable con la capa pura `authz`).

Commit sugerido: `feat(tickets): capa de datos CRUD de catálogos con permiso ticket_catalog.manage`

---

## Feature 2 — UI ABM de catálogos simples (priority, service_type, task_category)

- [x] Completada

Página única de administración con tabs (los tres recursos comparten shape: `name` +
opcionales `code`/`active` en priority). Patrón `TicketStatusAdminPage`.

### Archivos

- **Crear** `src/features/tickets/pages/TicketCatalogAdminPage.tsx` — tabs "Prioridades",
  "Tipos de servicio", "Categorías" (y "Empresas" se suma en F3).
- **Crear** `src/features/tickets/components/CatalogAdmin/CatalogTable.tsx` — tabla genérica
  reutilizable (columnas configurables) con acciones editar/eliminar.
- **Crear** `src/features/tickets/components/CatalogAdmin/PriorityFormDialog.tsx` — Zod
  (`name` y `code` obligatorios) + mutations de F1.
- **Crear** `src/features/tickets/components/CatalogAdmin/SimpleCatalogFormDialog.tsx` —
  diálogo compartido para service_type/task_category (solo `name`).
- **Crear** `src/features/tickets/schemas/catalogSchemas.ts` — `prioritySchema`, `simpleCatalogSchema`.
- **Modificar** `src/features/tickets/routes.tsx` — ruta `tickets/catalogos` con
  `protect(PERMISSIONS.TICKET_CATALOG_MANAGE)`.
- **Modificar** `src/shared/lib/navigation.js` — child "Catálogos" bajo Tickets con ese permiso.

### Dependencias

- **F1** (mutations y permiso).

### Criterio de hecho

- [x] CRUD end-to-end de los 3 catálogos desde `/tickets/catalogos` (verificado create+update+delete
      de `service_type` contra el backend real; create+delete de `priority` ya verificado en F1).
- [x] Los selects del formulario de tickets reflejan los cambios (invalidación de `ticketKeys.catalog`,
      mismo mecanismo verificado en F1).
- [x] Ruta y entrada de menú inaccesibles sin `ticket_catalog.manage` (permiso verificado en F1: Tecnico/Administrador ✓, Administrativo ✗).
- [x] `pnpm run build` pasa.

Commit sugerido: `feat(tickets): ABM de catálogos simples de tickets`

---

## Feature 3 — UI ABM de empresas proveedoras (provider_company)

- [x] Completada

Form más rico (`name` obligatorio + `support_portal_url`, `contact_name`, `contact_email`, `active`).

### Archivos

- **Crear** `src/features/tickets/components/CatalogAdmin/ProviderCompanyFormDialog.tsx` —
  Zod con validación de email/URL opcionales.
- **Modificar** `src/features/tickets/schemas/catalogSchemas.ts` — `providerCompanySchema`.
- **Modificar** `src/features/tickets/pages/TicketCatalogAdminPage.tsx` — tab "Empresas"
  (reutiliza `CatalogTable` con columnas extra: contacto, email, activo).

### Dependencias

- **F1** (mutations) y **F2** (página host y tabla genérica).

### Criterio de hecho

- [x] CRUD end-to-end de empresas; emails/URLs inválidos rechazados por Zod (verificado con
      casos válidos/inválidos vía script) y create+delete contra el backend real.
- [x] `pnpm run build` pasa.

Commit sugerido: `feat(tickets): ABM de empresas proveedoras`

---

## Feature 4 — Escritura de tracking_history (registrar evento manual)

- [ ] Completada

Alcance completo confirmado: el historial se registra manualmente desde el frontend.

### Archivos

- **Modificar** `src/features/tickets/types/index.ts` — `TrackingHistoryInput`
  (Omit de `id`/`createdat`/`updatedat`).
- **Modificar** `src/features/tickets/api/trackingHistoryService.ts` — `getById`, `create`,
  `update` (PUT), `remove`.
- **Modificar** `src/features/tickets/hooks/useTrackingHistory.ts` — `useCreateTrackingEntry`,
  `useUpdateTrackingEntry`, `useDeleteTrackingEntry` invalidando
  `ticketKeys.trackingHistory(additionalRequestId)`.
- **Crear** `src/features/tickets/components/TicketDetail/TrackingEntryFormDialog.tsx` —
  registrar evento (estado anterior/nuevo desde `useTicketStatuses`, comentario, fecha);
  botón visible con `hasPermission(TICKET_EDIT)` dentro de `TicketTrackingHistory`.
- **Crear** `src/features/tickets/schemas/trackingEntrySchema.ts` — Zod
  (`additional_request` requerido; lo inyecta el componente, no el usuario).
- **Modificar** `src/features/tickets/components/TicketDetail/TicketTrackingHistory.tsx` —
  botón "Registrar evento" + acciones editar/eliminar por entrada (gateadas).
- **Modificar** `src/features/tickets/index.ts` — exports nuevos.

### Dependencias

- Independiente de F1–F3 (puede hacerse en paralelo). Usa componentes existentes del detalle.

### Criterio de hecho

- [ ] Registrar/editar/eliminar un evento de seguimiento desde el detalle del pedido, end-to-end.
- [ ] El timeline se actualiza sin recargar.
- [ ] `pnpm run build` pasa.

Commit sugerido: `feat(tickets): registro manual de eventos de seguimiento`

---

## Feature 5 — Gaps menores de servicios existentes

- [ ] Completada

Completa las operaciones sueltas para cobertura total de la API.

### Archivos

- **Modificar** `src/features/tickets/api/additionalRequestService.ts` — `getById` (read) y
  `patch` parcial (p. ej. marcar `completion_date`/`active` sin reenviar todo).
- **Modificar** `src/features/tickets/api/ticketStatusService.ts` — `setActive` (PATCH `{active}`)
  para alternar estados sin PUT completo.
- **Modificar** `src/features/tickets/hooks/useAdditionalRequests.ts` /
  `useTicketStatuses.ts` — hooks para las operaciones nuevas donde la UI las use
  (toggle de activo en el ABM de estados).
- **Modificar** `src/features/tickets/pages/TicketStatusAdminPage.tsx` — switch/toggle de
  `active` usando el PATCH (mejora de UX sobre el form completo).

### Dependencias

- Ninguna estricta; conviene al final para cerrar la matriz.

### Criterio de hecho

- [ ] Matriz de cobertura completa: toda operación de `/ticket/*` en `api.d.ts` tiene su
      función de servicio tipada (y hook si la UI la consume).
- [ ] `pnpm run build` pasa.

Commit sugerido: `feat(tickets): completar operaciones restantes de la API de tickets`

---

## Orden recomendado

```
F1 ──> F2 ──> F3
F4 (paralelo a F1–F3)
F5 (cierre)
```

## Verificación global (al cerrar el plan)

- [ ] `pnpm run build` + `npx eslint src/features/tickets` limpios.
- [ ] Prueba manual con los tres roles: Tecnico ✓, Administrador ✓, Administrativo ✗ en
      `/tickets/catalogos` y acciones de escritura.
- [ ] Ninguna operación de `/ticket/*` sin implementación en servicios.
