import { redirect } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { can } from "@/lib/authz";
import { getDefaultRouteForGroup } from "@/shared/lib/navigation";

/**
 * Loaders de protección de rutas (React Router 7 data mode).
 * Son el "security boundary": redirigen ANTES de renderizar, sin flash ni
 * useEffect. Leen el estado de forma síncrona desde el store de Zustand
 * (sessionStorage síncrono garantiza que el token ya está rehidratado).
 *
 * NOTA: esto es solo gating de UI. El backend DEBE re-validar cada petición.
 */

/**
 * Exige una sesión activa. Lanza redirect a /auth/login (preservando 'from')
 * si no hay token. Devuelve el usuario autenticado para encadenar checks.
 */
export const requireAuth = (request) => {
  const { user } = useAuthStore.getState();
  if (!user?.token) {
    const from = request ? new URL(request.url).pathname : "/";
    throw redirect(`/auth/login?from=${encodeURIComponent(from)}`);
  }
  return user;
};

/**
 * Factory de loader: exige sesión + un permiso concreto.
 * Redirige a /unauthorized si el grupo no posee el permiso.
 * @param {string} [permission]
 */
export const protect =
  (permission) =>
  ({ request }) => {
    const user = requireAuth(request);
    if (permission && !can(user.group, permission)) {
      throw redirect("/unauthorized");
    }
    return null;
  };

/**
 * Para rutas públicas de auth: si el usuario YA está autenticado, lo saca de
 * la pantalla de login hacia su ruta por defecto.
 */
export const redirectIfAuthenticated = () => {
  const { user } = useAuthStore.getState();
  if (user?.token) {
    throw redirect(getDefaultRouteForGroup(user.group));
  }
  return null;
};
