# Proyecto Frontend - Asset Management System

Frontend para el backend del sistema Asset Management System, construido con React 19 y Vite. Provee la interfaz de usuario para gestionar activos.

## Tecnologías y Versiones

- **Node.js**: >=22.12.0
- **React**: 19.0.0
- **React DOM**: 19.0.0
- **Vite**: 6.1.2
- **Axios**: 1.7.9
- **TailwindCSS**: 4.0.17
- **@hookform/resolvers**: 4.1.2
- **react-hook-form**: 7.54.2
- **@tanstack/react-table**: 8.21.2
- **zustand**: 5.0.3
- **zod**: 3.24.2
- **clsx**: 2.1.1
- **crypto-js**: 4.2.0
- **react-router**: 7.2.0
- **react-to-print**: 3.0.5
- **@radix-ui/** (avatar, dialog, dropdown-menu, label, select, separator, slot, tabs): varias v1.x/v2.x
- **Tailwind Merge**: 3.0.2

DevDependencies:

- **@vitejs/plugin-react-swc**: 3.5.0
- **Vite**: 6.1.2
- **ESLint**: 9.19.0 (+ @eslint/js, eslint-plugin-react, react-hooks, react-refresh)
- **@types/react**: 19.0.8
- **@types/react-dom**: 19.0.3

## Estructura del Proyecto

```plaintext
front-ficha-tecnica/
├── public/              # Archivos estáticos públicos (index.html, favicon)
├── src/                 # Código fuente
│   ├── api/             # Servicios HTTP (axiosService.js, authService.js)
│   │   ├── auth/        # Componentes de autenticación y protección de rutas
│   │   ├── examples/    # Componentes de ejemplo y documentación
│   │   ├── pages/       # Páginas especiales (Unauthorized, etc.)
│   │   └── ...          # Otros componentes organizados por funcionalidad
│   ├── constants/       # Variables y constantes globales
│   │   └── permissions.js # Definición de grupos, permisos y configuración RBAC
│   ├── contexts/        # React Context para estado global
│   │   └── PermissionContext.jsx # Context para manejo de permisos
│   ├── hooks/           # Hooks personalizados
│   │   └── usePermission.js # Hook para verificación de permisos
│   ├── layouts/         # Layouts y wrappers de página
│   ├── lib/             # Utilidades y librerías internas
│   ├── routes/          # Definición de rutas y guards (AuthGuard, ProtectedRoute)
│   ├── store/           # Estado con Zustand
│   ├── statics/         # Activos estáticos (imágenes, fuentes)
│   ├── utils/           # Funciones auxiliares genéricas
│   │   └── navigation.js # Utilidades para navegación dinámica basada en permisos
│   ├── App.jsx          # Componente raíz que carga el Router
│   └── main.jsx         # Punto de entrada y renderizado en DOM
├── docs/                # Documentación del proyecto
│   ├── PERMISSION_SYSTEM.md # Documentación completa del sistema de permisos
│   └── RUTAS_PROTEGIDAS_IMPLEMENTACION.md # Guía de implementación
├── vite.config.js       # Configuración de Vite
└── package.json         # Dependencias y scripts
```

## Sistema de Control de Acceso Basado en Roles (RBAC)

El proyecto implementa un sistema completo de control de acceso basado en roles con las siguientes características:

### Grupos de Usuario

- **Administrador**: Acceso completo a todas las funcionalidades
- **Técnico**: Acceso a fichas técnicas, fichas de ingreso, toner e inventario
- **Administrativo**: Acceso limitado a fichas de ingreso, toner e inventario

### Componentes Principales

- `ProtectedRoute`: Protege rutas individuales basado en permisos
- `PermissionGuard`: Protege elementos UI específicos
- `usePermission`: Hook para verificación de permisos
- `PermissionProvider`: Context provider para manejo global de permisos

### Rutas Protegidas

Todas las rutas están protegidas por permisos específicos:

- Fichas de Ingreso (ver, crear, editar, eliminar)
- Fichas Técnicas (ver, crear, editar, eliminar)
- Ficha Toner (ver, crear, editar)
- Inventario (ver, buscar)

## Vinculación de Archivos

- `src/main.jsx` monta `<App />` sobre `#root`.
- `src/App.jsx` utiliza `RouterProvider` con el router de `src/routes/routes.jsx` envuelto en `PermissionProvider`.
- `src/routes/*` define rutas protegidas usando `AuthGuard` y `ProtectedRoute`.
- `src/api/axiosService.js` y `authService.js` ofrecen funciones HTTP usadas por hooks y componentes.
- `src/constants/permissions.js` define todos los permisos, grupos y configuración RBAC.
- `src/utils/navigation.js` proporciona navegación dinámica basada en permisos.
- Hooks en `src/hooks/` consumen servicios y gestionan lógica reusable.
- Contexts y store exponen estado global a la app.
- Componentes en `src/components/` implementan la UI consumiendo hooks, servicios y contexto.

## Buenas Prácticas para Commits y Ramas

### Ramas

- `main` rama de producción.
- `develop`: integración de features antes de release.
- `feature/<descripcion-corta>`: nuevas funcionalidades (e.g. `feature/impresion-ficha-tecnica`). En este caso, `impresion-ficha-tecnica` es una rama que se crea desde la rama `develop`, y en ella se va a trabajar en la implementación de la impresión de la ficha técnica. Cuando se complete la implementación, se hace un pull request para fusionarla con la rama `develop`.
- `fix/<descripcion-corta>`: correcciones de bugs (e.g. `fix/bug-login`). En este caso, `bug-login` es una rama que se crea desde la rama `develop`, y en ella se va a trabajar en la corrección del bug de login. Cuando se complete la corrección, se hace un pull request para fusionarla con la rama `develop`.
- `chore/<descripcion-corta>`: tareas de mantenimiento (e.g. `chore/actualizacion-dependencias`). En este caso, `actualizacion-dependencias` es una rama que se crea desde la rama `develop`, y en ella se va a trabajar en la actualización de las dependencias. Cuando se complete la actualización, se hace un pull request para fusionarla con la rama `develop`.

### Commits (Conventional Commits)

- Formato: `<tipo>(<ámbito>): <descripción corta>`
- Tipos comunes:
  - `feat`: nueva funcionalidad (e.g. `feat(login): agregar validación de contraseña`).
  - `fix`: solución de bug (e.g. `fix(login): corregir error de validación`).
  - `chore`: cambios de infraestructura o mantenimiento (e.g. `chore(dependencias): actualizar dependencias`).
  - `docs`: cambios en documentación (e.g. `docs(readme): actualizar documentación`).
  - `refactor`: refactorización sin nuevas funcionalidades ni fixes (e.g. `refactor(login): mejorar validación`).
- Ejemplo: `feat(login): agregar validación de contraseña`.
- Mensaje de commit debe ser claro, en tiempo presente y mantener el scope.

# Solucion de Error

Si no funciona el comando `npm i` ejecutar el siguiente comando:

```bash
npm install @vitejs/plugin-react-swc@latest --save-dev
```

Esto soluciona el error de que esta desactualizado el plugin de react-swc.
