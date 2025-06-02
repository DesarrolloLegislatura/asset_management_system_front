# Implementación de Rutas Protegidas - Asset Management System

## Resumen de la Implementación

Se ha implementado un sistema completo de rutas protegidas basado en roles para el sistema de gestión de activos, reemplazando el sistema anterior (`GroupsGuard`) con un enfoque más moderno y escalable.

## Cambios Realizados

### 1. Sistema de Permisos Actualizado

Los permisos se han actualizado para reflejar las funcionalidades reales de la aplicación:

```javascript
// Permisos disponibles
export const PERMISSIONS = {
  // Fichas Técnicas (solo edición y visualización, no creación)
  TECHNICAL_SHEET_VIEW: "technical_sheet.view",
  TECHNICAL_SHEET_EDIT: "technical_sheet.edit",
  TECHNICAL_SHEET_DELETE: "technical_sheet.delete",

  // Fichas de Ingreso
  FICHA_INGRESO_VIEW: "ficha_ingreso.view",
  FICHA_INGRESO_CREATE: "ficha_ingreso.create",
  FICHA_INGRESO_EDIT: "ficha_ingreso.edit",
  FICHA_INGRESO_DELETE: "ficha_ingreso.delete",

  // Ficha Toner
  FICHA_TONER_VIEW: "ficha_toner.view",
  FICHA_TONER_CREATE: "ficha_toner.create",
  FICHA_TONER_EDIT: "ficha_toner.edit",

  // Inventario
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_SEARCH: "inventory.search",
};
```

### 2. Configuración de Grupos

| Grupo              | Permisos                            | Acceso a Rutas                                                       |
| ------------------ | ----------------------------------- | -------------------------------------------------------------------- |
| **Administrador**  | Todos los permisos                  | Acceso completo a todas las rutas                                    |
| **Técnico**        | Fichas técnicas + Fichas de ingreso | Fichas técnicas (solo edición), Fichas de ingreso, Toner, Inventario |
| **Administrativo** | Solo Fichas de ingreso + Toner      | Fichas de ingreso, Toner, Inventario                                 |

### 3. Rutas Protegidas Implementadas

```javascript
// Antes (usando GroupsGuard)
<GroupsGuard allowedGroups={["Admin", "Tecnico"]}>
  <FichaTecnicaForm />
</GroupsGuard>

// Ahora (usando ProtectedRoute)
<ProtectedRoute permission={PERMISSIONS.TECHNICAL_SHEET_EDIT}>
  <FichaTecnicaForm />
</ProtectedRoute>
```

#### Mapeo de Rutas y Permisos:

| Ruta                        | Componente           | Permiso Requerido      | Descripción                |
| --------------------------- | -------------------- | ---------------------- | -------------------------- |
| `/`                         | `FichaIngresoList`   | `FICHA_INGRESO_VIEW`   | Página principal con lista |
| `/ficha-ingreso`            | `FichaIngresoForm`   | `FICHA_INGRESO_CREATE` | Crear nueva ficha          |
| `/ficha-ingreso/:id`        | `FichaIngresoForm`   | `FICHA_INGRESO_EDIT`   | Editar ficha existente     |
| `/ficha-ingreso/detail/:id` | `FichaIngresoDetail` | `FICHA_INGRESO_VIEW`   | Ver detalle de ficha       |
| `/ficha-tecnica/:id`        | `FichaTecnicaForm`   | `TECHNICAL_SHEET_EDIT` | Editar ficha técnica\*     |
| `/ficha-tecnica/detail/:id` | `FichaTecnicaDetail` | `TECHNICAL_SHEET_VIEW` | Ver ficha técnica          |
| `/ficha-toner`              | `FichaTonerForm`     | `FICHA_TONER_VIEW`     | Gestión de toner           |
| `/inventory`                | `InventorySerch`     | `INVENTORY_VIEW`       | Búsqueda de inventario     |

**\*Nota importante**: Las fichas técnicas **no se crean independientemente**. Solo pueden actualizar/continuar fichas de ingreso previamente creadas. Para acceder a una ficha técnica, primero debe existir una ficha de ingreso.

### 4. Estados del Bien por Contexto

Se han definido estados específicos según el tipo de ficha:

#### Ficha de Ingreso:

- **Al crear**: Solo "Ingreso"
- **Al editar**: "Ingreso", "Retirado", "Listo para retirar", "Salida", "Finalizado"

#### Ficha Técnica:

- "En reparación"
- "En espera de repuesto"
- "Diagnóstico pendiente"
- "Reparado"
- "Se recomienda baja"
- "En reparación externa"

### 5. Componente ProtectedRoute

El componente `ProtectedRoute` reemplaza completamente al `GroupsGuard` y proporciona:

- ✅ Verificación de autenticación
- ✅ Verificación de permisos específicos
- ✅ Verificación de acceso a rutas por grupo
- ✅ Redirección automática a `/unauthorized`
- ✅ Manejo de estados de carga

### 6. Navegación Actualizada

La navegación se ha actualizado para mostrar solo las opciones disponibles:

```javascript
export const navigationItems = [
  {
    title: "Fichas de Ingreso",
    href: "/",
    icon: ClipboardCheck,
    permission: PERMISSIONS.FICHA_INGRESO_VIEW,
    children: [
      {
        title: "Ver Fichas",
        href: "/",
        permission: PERMISSIONS.FICHA_INGRESO_VIEW,
      },
      {
        title: "Nueva Ficha",
        href: "/ficha-ingreso",
        permission: PERMISSIONS.FICHA_INGRESO_CREATE,
      },
    ],
  },
  {
    title: "Fichas Técnicas",
    href: "/", // Redirige a lista para seleccionar cuál editar
    icon: FileText,
    permission: PERMISSIONS.TECHNICAL_SHEET_VIEW,
    description: "Ver fichas técnicas (editar desde fichas de ingreso)",
  },
  // ... otros items
];
```

## Cómo Usar el Sistema

### 1. Verificación de Permisos en Componentes

```jsx
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS } from "@/constants/permissions";

function MyComponent() {
  const { hasPermission, can } = usePermission();

  return (
    <div>
      {hasPermission(PERMISSIONS.FICHA_INGRESO_CREATE) && (
        <Button>Crear Ficha</Button>
      )}

      {can("edit", "ficha_ingreso") && <Button>Editar</Button>}
    </div>
  );
}
```

### 2. Estados del Bien Según Contexto

```jsx
import { getEstadosByContext } from "@/constants/estados";

// Para ficha de ingreso (crear)
const estadosCreate = getEstadosByContext("ficha_ingreso", false);

// Para ficha de ingreso (editar)
const estadosEdit = getEstadosByContext("ficha_ingreso", true);

// Para ficha técnica
const estadosTecnica = getEstadosByContext("ficha_tecnica");
```

### 3. Protección de Elementos UI

```jsx
import { PermissionGuard } from "@/components/auth/PermissionGuard";

<PermissionGuard permission={PERMISSIONS.FICHA_INGRESO_DELETE}>
  <Button variant="destructive">Eliminar</Button>
</PermissionGuard>;
```

## Beneficios de la Nueva Implementación

### 🔒 **Seguridad Mejorada**

- Verificación granular de permisos
- Control centralizado de acceso
- Redirección automática para accesos no autorizados
- Estados del bien contextualizados

### 🎯 **Mejor UX**

- Navegación dinámica que muestra solo opciones disponibles
- Retroalimentación clara cuando no hay permisos
- Flujo lógico: Ficha Ingreso → Ficha Técnica
- Carga optimizada de componentes

### 🛠️ **Mantenibilidad**

- Permisos centralizados en un solo archivo
- Estados del bien organizados por contexto
- Componentes reutilizables para protección
- Fácil adición de nuevos permisos y rutas

### 📈 **Escalabilidad**

- Sistema basado en permisos granulares
- Separación clara entre tipos de fichas
- Fácil adición de nuevos grupos y roles
- Estados contextualizados para cada flujo

## Flujo de Trabajo con Fichas

### 1. Flujo Normal

1. **Crear Ficha de Ingreso** → Estado: "Ingreso"
2. **Editar Ficha Técnica** (desde la ficha de ingreso) → Estados técnicos
3. **Finalizar proceso** → Actualizar estado en ficha de ingreso

### 2. Estados Permitidos

- **Inicio**: Solo "Ingreso" al crear ficha de ingreso
- **Proceso Técnico**: Estados específicos de reparación/diagnóstico
- **Finalización**: Estados de salida en ficha de ingreso

## Archivos Modificados

1. **`src/routes/routes.jsx`** - Rutas actualizadas (eliminada creación de fichas técnicas)
2. **`src/constants/permissions.js`** - Permisos actualizados
3. **`src/constants/estados.js`** - **NUEVO** - Estados contextualizados
4. **`src/utils/navigation.js`** - Navegación actualizada
5. **`src/App.jsx`** - Envuelto con PermissionProvider

## Próximos Pasos

1. **Validación en Backend**: Implementar las mismas verificaciones en el API
2. **Testing**: Agregar tests para todas las rutas protegidas
3. **Estados del Bien**: Implementar lógica de estados en formularios
4. **Logs de Auditoria**: Implementar logging de accesos

---

**Nota**: El sistema anterior (`GroupsGuard`) ha sido completamente reemplazado por el nuevo sistema de permisos.
