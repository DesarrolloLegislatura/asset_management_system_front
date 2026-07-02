import { createBrowserRouter } from "react-router";
import { AuthLayout } from "@/shared/layouts/AuthLayout.jsx";
import { MainLayout } from "@/shared/layouts/MainLayout";
import { LoginForm } from "@/shared/auth/components/LoginForm.jsx";
import NotFound from "@/shared/pages/NotFoundPage.jsx";
import { Unauthorized } from "@/shared/pages/UnauthorizedPage.jsx";
import { requireAuth, redirectIfAuthenticated } from "@/shared/auth/guards.js";
import { fichasRoutes } from "@/features/fichas";
import { ticketsRoutes } from "@/features/tickets";

const routes = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginForm />,
        loader: redirectIfAuthenticated,
      },
    ],
  },
  {
    // error 404
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <MainLayout />,
    // Gate de autenticación a nivel layout (reemplaza al antiguo <AuthGuard>).
    loader: ({ request }) => requireAuth(request),
    children: [
      // Dominio fichas (rutas y permisos definidos en el propio feature).
      ...fichasRoutes,
      // Feature piloto tickets (andamiaje, sin permiso propio todavía;
      // protegida solo por el gate de sesión del layout padre).
      ...ticketsRoutes,
    ],
  },
  {
    // Página de acceso no autorizado
    path: "/unauthorized",
    element: <Unauthorized />,
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  },
});

export default router;
