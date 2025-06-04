# 🌙 Sistema de Modo Oscuro

Este proyecto ahora incluye un sistema completo de modo oscuro compatible con React 19, Tailwind CSS v4 y shadcn/ui.

## 🚀 Características Implementadas

### ✅ **Características Principales**

- **Cambio automático de tema** basado en preferencias del sistema
- **Persistencia** del tema seleccionado en localStorage
- **Transiciones suaves** entre temas
- **Botón de alternancia** con iconos animados
- **Variables CSS** optimizadas para ambos modos
- **Compatibilidad completa** con shadcn/ui

### 🎯 **Componentes Creados**

1. **ThemeContext** (`src/contexts/ThemeContext.jsx`)

   - Maneja el estado global del tema
   - Detecta preferencias del sistema
   - Persiste la selección en localStorage

2. **ThemeToggle** (`src/components/ui/theme-toggle.jsx`)

   - Botón animado para cambiar tema
   - Iconos de sol/luna con transiciones
   - Integrado en el Navbar

3. **Hook useTheme** (`src/hooks/useTheme.js`)
   - Hook personalizado para acceder al tema
   - API simplificada para componentes

## 🛠️ Uso

### Cambiar Tema Programáticamente

```jsx
import { useTheme } from "@/hooks/useTheme";

function MiComponente() {
  const { theme, toggleTheme, setDarkTheme, setLightTheme, isDark } =
    useTheme();

  return (
    <div>
      <p>Tema actual: {theme}</p>
      <button onClick={toggleTheme}>Alternar tema</button>
      <button onClick={setDarkTheme}>Modo oscuro</button>
      <button onClick={setLightTheme}>Modo claro</button>
      {isDark && <p>Está en modo oscuro 🌙</p>}
    </div>
  );
}
```

### Clases CSS Recomendadas

Para componentes personalizados, usa las variables de tema de shadcn:

```jsx
// ✅ Correcto - Compatible con modo oscuro
<div className="bg-background text-foreground border-border">
  <p className="text-muted-foreground">Texto secundario</p>
</div>

// ❌ Evitar - Colores hardcodeados
<div className="bg-white text-black border-gray-300">
  <p className="text-gray-500">Texto secundario</p>
</div>
```

## 📋 Variables de Tema Disponibles

El sistema utiliza las siguientes variables CSS que se adaptan automáticamente:

### Colores Principales

- `background` - Fondo principal
- `foreground` - Texto principal
- `muted` - Elementos atenuados
- `muted-foreground` - Texto atenuado
- `border` - Bordes
- `input` - Campos de entrada

### Colores de Componentes

- `card` / `card-foreground`
- `primary` / `primary-foreground`
- `secondary` / `secondary-foreground`
- `accent` / `accent-foreground`
- `destructive` / `destructive-foreground`

## 🎨 Personalización

### Modificar Colores del Tema

Edita las variables en `src/index.css`:

```css
:root {
  --background: oklch(1 0 0); /* Modo claro */
  --foreground: oklch(0.129 0.042 264.695);
  /* ... otros colores */
}

.dark {
  --background: oklch(0.129 0.042 264.695); /* Modo oscuro */
  --foreground: oklch(0.984 0.003 247.858);
  /* ... otros colores */
}
```

### Detectar Tema en Componentes

```jsx
import { useTheme } from "@/hooks/useTheme";

function ComponenteCondicional() {
  const { isDark, isLight } = useTheme();

  return (
    <div>
      {isDark && <img src="/logo-dark.png" alt="Logo" />}
      {isLight && <img src="/logo-light.png" alt="Logo" />}
    </div>
  );
}
```

## 🔧 Configuración Técnica

### Estructura de Archivos

```
src/
├── contexts/
│   └── ThemeContext.jsx         # Contexto principal del tema
├── components/ui/
│   ├── theme-toggle.jsx         # Botón de alternancia
│   └── theme-status.jsx         # Estado del tema (desarrollo)
├── hooks/
│   └── useTheme.js             # Hook personalizado
└── index.css                   # Variables CSS del tema
```

### Integración en App.jsx

```jsx
import { ThemeProvider } from "@/contexts/ThemeContext";

function App() {
  return <ThemeProvider>{/* Tu aplicación */}</ThemeProvider>;
}
```

## 📱 Compatibilidad

- ✅ React 19
- ✅ Tailwind CSS v4
- ✅ shadcn/ui
- ✅ Todas las versiones modernas de navegadores
- ✅ Responsive design
- ✅ Accesibilidad (aria-labels)

## 🐛 Solución de Problemas

### El tema no persiste entre sesiones

Verifica que localStorage esté disponible en tu entorno.

### Componentes no respetan el tema oscuro

Asegúrate de usar las variables CSS de shadcn en lugar de colores hardcodeados.

### Flash de contenido sin estilizar (FOUC)

El sistema detecta automáticamente las preferencias del sistema para minimizar este efecto.

## 📚 Recursos Adicionales

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [React Context API](https://react.dev/reference/react/useContext)

---

¡El modo oscuro está listo para usar! 🌙✨
