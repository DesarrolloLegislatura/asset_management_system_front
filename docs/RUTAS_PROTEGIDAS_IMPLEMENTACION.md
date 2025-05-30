# Implementación de Rutas Protegidas - Asset Management System

## Resumen de la Implementación

Se ha implementado un sistema completo de rutas protegidas basado en roles para el sistema de gestión de activos, reemplazando el sistema anterior (`GroupsGuard`) con un enfoque más moderno y escalable.

## Cambios Realizados

### 1. Sistema de Permisos Actualizado

Los permisos se han actualizado para reflejar las funcionalidades reales de la aplicación:

```javascript
// Permisos disponibles
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",
  DASHBOARD_STATS: "dashboard.stats",

  // Gestión de Activos
  ASSETS_VIEW: "assets.view",
  ASSETS_CREATE: "assets.create",
  ASSETS_EDIT: "assets.edit",
  ASSETS_DELETE: "assets.delete",
  ASSETS_EXPORT: "assets.export",

  // Fichas Técnicas
  TECHNICAL_SHEET_VIEW: "technical_sheet.view",
  TECHNICAL_SHEET_CREATE: "technical_sheet.create",
  TECHNICAL_SHEET_EDIT: "technical_sheet.edit",
  TECHNICAL_SHEET_DELETE: "technical_sheet.delete",

  // Fichas de Ingreso
  FICHA_INGRESO_VIEW: "ficha_ingreso.view",
  FICHA_INGRESO_CREATE: "ficha_ingreso.create",
  FICHA_INGRESO_EDIT: "ficha_ingreso.edit",
  FICHA_INGRESO_DELETE: "ficha_ingreso.delete",
};
```

### 2. Configuración de Grupos

| Grupo              | Permisos                            | Acceso a Rutas                                                             |
| ------------------ | ----------------------------------- | -------------------------------------------------------------------------- |
| **Administrador**  | Todos los permisos                  | Acceso completo a todas las rutas                                          |
| **Técnico**        | Fichas técnicas + Fichas de ingreso | Dashboard, Fichas técnicas, Fichas de ingreso, Toner, Activos (solo vista) |
| **Administrativo** | Solo Fichas de ingreso + Dashboard  | Dashboard, Fichas de ingreso, Toner                                        |

### 3. Rutas Protegidas Implementadas

```javascript
// Antes (usando GroupsGuard)
<GroupsGuard allowedGroups={["Admin", "Tecnico"]}>
  <FichaTecnicaForm />
</GroupsGuard>

// Ahora (usando ProtectedRoute)
<ProtectedRoute permission={PERMISSIONS.TECHNICAL_SHEET_CREATE}>
  <FichaTecnicaForm />
</ProtectedRoute>
```

#### Mapeo de Rutas y Permisos:

| Ruta                        | Componente           | Permiso Requerido        | Descripción                |
| --------------------------- | -------------------- | ------------------------ | -------------------------- |
| `/`                         | `FichaIngresoList`   | `FICHA_INGRESO_VIEW`     | Página principal con lista |
| `/ficha-ingreso`            | `FichaIngresoForm`   | `FICHA_INGRESO_CREATE`   | Crear nueva ficha          |
| `/ficha-ingreso/:id`        | `FichaIngresoForm`   | `FICHA_INGRESO_EDIT`     | Editar ficha existente     |
| `/ficha-ingreso/detail/:id` | `FichaIngresoDetail` | `FICHA_INGRESO_VIEW`     | Ver detalle de ficha       |
| `/ficha-tecnica`            | `FichaTecnicaForm`   | `TECHNICAL_SHEET_CREATE` | Crear ficha técnica        |
| `/ficha-tecnica/:id`        | `FichaTecnicaForm`   | `TECHNICAL_SHEET_EDIT`   | Editar ficha técnica       |
| `/ficha-tecnica/detail/:id` | `FichaTecnicaDetail` | `TECHNICAL_SHEET_VIEW`   | Ver ficha técnica          |
| `/ficha-toner`              | `FichaTonerForm`     | `FICHA_INGRESO_VIEW`     | Gestión de toner           |

### 4. Componente ProtectedRoute

El componente `ProtectedRoute` reemplaza completamente al `GroupsGuard` y proporciona:

- ✅ Verificación de autenticación
- ✅ Verificación de permisos específicos
- ✅ Verificación de acceso a rutas por grupo
- ✅ Redirección automática a `/unauthorized`
- ✅ Manejo de estados de carga

### 5. Navegación Actualizada

La navegación se ha actualizado para mostrar solo las opciones disponibles:

```javascript
export const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  {
    title: "Fichas Técnicas",
    href: "/ficha-tecnica",
    icon: FileText,
    permission: PERMISSIONS.TECHNICAL_SHEET_VIEW,
  },
  {
    title: "Fichas de Ingreso",
    href: "/ficha-ingreso",
    icon: ClipboardCheck,
    permission: PERMISSIONS.FICHA_INGRESO_VIEW,
  },
  {
    title: "Ficha Toner",
    href: "/ficha-toner",
    icon: Printer,
    permission: PERMISSIONS.FICHA_INGRESO_VIEW,
  },
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

### 2. Protección de Elementos UI

```jsx
import { PermissionGuard } from "@/components/auth/PermissionGuard";

<PermissionGuard permission={PERMISSIONS.FICHA_INGRESO_DELETE}>
  <Button variant="destructive">Eliminar</Button>
</PermissionGuard>;
```

### 3. Navegación Condicional

```jsx
import { getFilteredNavigation } from "@/utils/navigation";
import { usePermissions } from "@/contexts/PermissionContext";

function Navigation() {
  const { permissions } = usePermissions();
  const menuItems = getFilteredNavigation(permissions);

  return (
    <nav>
      {menuItems.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </nav>
  );
}
```

## Beneficios de la Nueva Implementación

### 🔒 **Seguridad Mejorada**

- Verificación granular de permisos
- Control centralizado de acceso
- Redirección automática para accesos no autorizados

### 🎯 **Mejor UX**

- Navegación dinámica que muestra solo opciones disponibles
- Retroalimentación clara cuando no hay permisos
- Carga optimizada de componentes

### 🛠️ **Mantenibilidad**

- Permisos centralizados en un solo archivo
- Componentes reutilizables para protección
- Fácil adición de nuevos permisos y rutas

### 📈 **Escalabilidad**

- Sistema basado en permisos granulares
- Fácil adición de nuevos grupos y roles
- Separación clara entre UI y lógica de permisos

## Migración del Sistema Anterior

### ❌ Antes (GroupsGuard)

```jsx
<GroupsGuard allowedGroups={["Admin", "Tecnico"]}>
  <Component />
</GroupsGuard>
```

### ✅ Ahora (ProtectedRoute)

```jsx
<ProtectedRoute permission={PERMISSIONS.SPECIFIC_PERMISSION}>
  <Component />
</ProtectedRoute>
```

## Testing

El sistema incluye utilidades para testing:

```jsx
import { PermissionWrapper } from "./utils/permission-wrapper";

test("muestra componente con permisos correctos", () => {
  render(
    <PermissionWrapper mockPermissions={[PERMISSIONS.FICHA_INGRESO_VIEW]}>
      <MyComponent />
    </PermissionWrapper>
  );

  expect(screen.getByText("Contenido")).toBeInTheDocument();
});
```

## Archivos Modificados

1. **`src/routes/routes.jsx`** - Rutas completamente actualizadas
2. **`src/constants/permissions.js`** - Permisos y configuración actualizada
3. **`src/utils/navigation.js`** - Navegación actualizada
4. **`src/App.jsx`** - Envuelto con PermissionProvider

## Próximos Pasos

1. **Validación en Backend**: Implementar las mismas verificaciones en el API
2. **Testing**: Agregar tests para todas las rutas protegidas
3. **Logs de Auditoria**: Implementar logging de accesos
4. **Documentación de Usuario**: Crear guía para usuarios finales

---

**Nota**: El sistema anterior (`GroupsGuard`) puede ser eliminado una vez confirmado que todo funciona correctamente.
