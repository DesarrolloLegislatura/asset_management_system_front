# Sistema de Control de Permisos - Asset Management System

## Resumen

Este documento describe la implementación del sistema de control de acceso basado en grupos (RBAC) para la aplicación de gestión de activos.

## Arquitectura

El sistema está basado en los siguientes componentes principales:

### 1. Grupos de Usuario

- **Administrador**: Acceso completo a todas las funcionalidades
- **Técnico**: Acceso a fichas técnicas y mantenimiento
- **Administrativo**: Acceso a reportes y visualización de datos

### 2. Estructura de Permisos

Los permisos siguen el formato: `recurso.acción`

Ejemplo: `assets.create`, `reports.view`, `maintenance.approve`

## Componentes Principales

### PermissionProvider

Contexto principal que provee las funciones de verificación de permisos.

```jsx
import { PermissionProvider } from "@/contexts/PermissionContext";

function App() {
  return <PermissionProvider>{/* Tu aplicación */}</PermissionProvider>;
}
```

### usePermission Hook

Hook principal para verificar permisos en componentes.

```jsx
import { usePermission } from "@/hooks/usePermission";

function MyComponent() {
  const { can, isInGroup, hasPermission } = usePermission();

  if (can("create", "assets")) {
    // Usuario puede crear activos
  }

  if (isInGroup("Administrador")) {
    // Usuario es administrador
  }
}
```

### PermissionGuard

Componente para proteger elementos de UI basado en permisos.

```jsx
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/constants/permissions";

function MyComponent() {
  return (
    <PermissionGuard permission={PERMISSIONS.ASSETS_CREATE}>
      <Button>Crear Activo</Button>
    </PermissionGuard>
  );
}
```

### ProtectedRoute

Componente para proteger rutas completas.

```jsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

<Route
  path="/admin"
  element={
    <ProtectedRoute permission={PERMISSIONS.USERS_VIEW}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>;
```

## Patrones de Uso

### 1. Proteger Botones/Acciones

```jsx
// Opción 1: Usando PermissionGuard
<PermissionGuard permission={PERMISSIONS.ASSETS_DELETE}>
  <Button variant="destructive">Eliminar</Button>
</PermissionGuard>

// Opción 2: Usando CanRender
<CanRender action="delete" resource="assets">
  <Button variant="destructive">Eliminar</Button>
</CanRender>

// Opción 3: Usando el hook directamente
{can('delete', 'assets') && (
  <Button variant="destructive">Eliminar</Button>
)}
```

### 2. Mostrar Contenido por Grupo

```jsx
// Mostrar solo para administradores
<GroupRender groups="Administrador">
  <AdminDashboard />
</GroupRender>

// Mostrar para múltiples grupos
<GroupRender groups={['Técnico', 'Administrativo']}>
  <SharedContent />
</GroupRender>
```

### 3. Navegación Dinámica

```jsx
import { getFilteredNavigation } from "@/utils/navigation";
import { usePermissions } from "@/contexts/PermissionContext";

function Navigation() {
  const { permissions } = usePermissions();
  const menuItems = getFilteredNavigation(permissions);

  return (
    <nav>
      {menuItems.map((item) => (
        <NavLink key={item.href} to={item.href}>
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}
```

### 4. Formularios con Permisos

```jsx
function AssetForm() {
  const { can } = usePermission();

  return (
    <form>
      <Input name="name" label="Nombre" />

      <PermissionGuard permission={PERMISSIONS.ASSETS_EDIT}>
        <Input name="value" label="Valor" />
      </PermissionGuard>

      <div className="flex gap-2">
        {can("create", "assets") && <Button type="submit">Crear</Button>}

        {can("update", "assets") && <Button type="button">Actualizar</Button>}
      </div>
    </form>
  );
}
```

## Mejores Prácticas

### 1. Centralización de Permisos

Siempre define los permisos en el archivo de constantes:

```javascript
// constants/permissions.js
export const PERMISSIONS = {
  ASSETS_VIEW: "assets.view",
  ASSETS_CREATE: "assets.create",
  // ...
};
```

### 2. Verificación en Frontend y Backend

El frontend debe ocultar elementos, pero el backend debe validar permisos:

```javascript
// Frontend (React)
<PermissionGuard permission={PERMISSIONS.ASSETS_DELETE}>
  <Button onClick={handleDelete}>Eliminar</Button>
</PermissionGuard>;

// Backend (API)
app.delete(
  "/api/assets/:id",
  requirePermission("assets.delete"),
  (req, res) => {
    // Lógica de eliminación
  }
);
```

### 3. Fallbacks Apropiados

Siempre proporciona fallbacks informativos:

```jsx
<PermissionGuard
  permission={PERMISSIONS.REPORTS_CREATE}
  fallback={
    <Alert>
      No tienes permisos para crear reportes. Contacta a tu administrador.
    </Alert>
  }
>
  <ReportForm />
</PermissionGuard>
```

### 4. Manejo de Estados de Carga

El sistema de permisos puede tener estados de carga:

```jsx
function ProtectedContent() {
  const { permissions } = usePermissions();

  if (!permissions.length) {
    return <Spinner />;
  }

  return <Content />;
}
```

## Configuración de Rutas Protegidas

### 1. Definir Rutas por Grupo

```javascript
// constants/permissions.js
export const GROUP_ROUTES = {
  Administrador: ["/dashboard", "/assets", "/users", "/settings"],
  Técnico: ["/dashboard", "/technical-sheets", "/maintenance"],
};
```

### 2. Implementar en Router

```jsx
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/*"
        element={
          <ProtectedRoute permission={PERMISSIONS.USERS_VIEW}>
            <UsersModule />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}
```

## Testing

### 1. Mock del Provider

```jsx
// tests/utils/permission-wrapper.jsx
export const PermissionWrapper = ({ children, mockPermissions = [] }) => {
  const mockValue = {
    permissions: mockPermissions,
    hasPermission: (perm) => mockPermissions.includes(perm),
    // ... otras funciones
  };

  return (
    <PermissionContext.Provider value={mockValue}>
      {children}
    </PermissionContext.Provider>
  );
};
```

### 2. Test de Componentes

```jsx
import { render, screen } from "@testing-library/react";
import { PermissionWrapper } from "./utils/permission-wrapper";
import { MyComponent } from "@/components/MyComponent";
import { PERMISSIONS } from "@/constants/permissions";

test("muestra botón crear cuando tiene permisos", () => {
  render(
    <PermissionWrapper mockPermissions={[PERMISSIONS.ASSETS_CREATE]}>
      <MyComponent />
    </PermissionWrapper>
  );

  expect(screen.getByText("Crear Activo")).toBeInTheDocument();
});
```

## Solución de Problemas

### Error: "usePermissions must be used within a PermissionProvider"

Asegúrate de envolver tu aplicación con el PermissionProvider:

```jsx
// main.jsx o App.jsx
<PermissionProvider>
  <App />
</PermissionProvider>
```

### Los permisos no se actualizan

Verifica que el grupo del usuario esté correctamente establecido en el store:

```javascript
// Al hacer login
setUser({
  ...userData,
  group: userData.groups[0], // o la lógica que corresponda
});
```

### Componentes no se ocultan correctamente

1. Verifica que el permiso esté definido en las constantes
2. Asegúrate de que el grupo tenga asignado ese permiso
3. Revisa que estés usando el componente correcto (PermissionGuard, CanRender, etc.)

## Fuentes y Referencias

- [React Context API Documentation](https://react.dev/reference/react/createContext)
- [React Router Protected Routes](https://reactrouter.com/en/main)
- [RBAC Best Practices](https://www.permit.io/blog/implementing-react-rbac-authorization)
- [Zustand State Management](https://github.com/pmndrs/zustand)
