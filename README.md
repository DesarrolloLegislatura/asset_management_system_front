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
│   ├── components/      # Componentes React reutilizables
│   ├── constants/       # Variables y constantes globales
│   ├── contexts/        # React Context para estado global
│   ├── hooks/           # Hooks personalizados
│   ├── layouts/         # Layouts y wrappers de página
│   ├── lib/             # Utilidades y librerías internas
│   ├── routes/          # Definición de rutas y guards (AuthGuard, GroupsGuard)
│   ├── store/           # Estado con Zustand
│   ├── statics/         # Activos estáticos (imágenes, fuentes)
│   ├── utils/           # Funciones auxiliares genéricas
│   ├── App.jsx          # Componente raíz que carga el Router
│   └── main.jsx         # Punto de entrada y renderizado en DOM
├── vite.config.js       # Configuración de Vite
└── package.json         # Dependencias y scripts
```

## Vinculación de Archivos

- `src/main.jsx` monta `<App />` sobre `#root`.
- `src/App.jsx` utiliza `RouterProvider` con el router de `src/routes/routes.jsx`.
- `src/routes/*` define rutas y aplica `AuthGuard.jsx` y `GroupsGuard.jsx`.
- `src/api/axiosService.js` y `authService.js` ofrecen funciones HTTP usadas por hooks y componentes.
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
