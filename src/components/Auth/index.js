// Componentes de protección (gating de UI). La protección de rutas vive en
// los loaders de React Router (src/shared/auth/guards.js).
export { PermissionGuard } from "./PermissionGuard";
export { ConditionalRender, GroupRender, CanRender } from "./ConditionalRender";

// Páginas
export { UnauthorizedPage } from "../Pages/UnauthorizedPage";
