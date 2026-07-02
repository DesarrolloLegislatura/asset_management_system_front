import { createBrowserRouter } from "react-router";
import { AuthLayout } from "../layouts/AuthLayout.jsx";
import { MainLayout } from "../layouts/MainLayout";
import { LoginForm } from "@/shared/auth/components/LoginForm.jsx";
import { FichaTecnicaForm } from "@/components/FichaTecnica/FichaTecnicaForm.jsx";
import { FichaIngresoForm } from "@/components/FichaIngreso/FichaIngresoForm.jsx";
import NotFound from "@/shared/pages/NotFoundPage.jsx";
import { Unauthorized } from "@/shared/pages/UnauthorizedPage.jsx";
import { PERMISSIONS } from "@/shared/auth/permissions.js";
import { FichaList } from "@/components/FichaList/FichaList.jsx";
import { FichaDetail } from "@/components/FichaDetail/FichaDetail.jsx";
import { FichaServicioForm } from "@/components/FichaServicion/FichaServicioForm.jsx";
import { requireAuth, protect, redirectIfAuthenticated } from "@/shared/auth/guards.js";
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
      {
        // Página principal - Lista de Fichas de Ingreso
        index: true,
        element: <FichaList />,
        loader: protect(PERMISSIONS.FICHA_INGRESO_VIEW),
      },
      {
        // Editar ficha técnica (desde una ficha de ingreso existente)
        path: "ficha-tecnica/:idFichaIngreso",
        element: <FichaTecnicaForm />,
        loader: protect(PERMISSIONS.TECHNICAL_SHEET_EDIT),
      },
      {
        // Ver detalle de ficha técnica
        path: "ficha-tecnica/detail/:idFichaIngreso",
        element: <FichaDetail />,
        loader: protect(PERMISSIONS.TECHNICAL_SHEET_VIEW),
      },
      {
        // Crear nueva ficha de ingreso
        path: "ficha-ingreso",
        element: <FichaIngresoForm />,
        loader: protect(PERMISSIONS.FICHA_INGRESO_CREATE),
      },
      {
        // Editar ficha de ingreso
        path: "ficha-ingreso/:idFichaIngreso",
        element: <FichaIngresoForm />,
        loader: protect(PERMISSIONS.FICHA_INGRESO_EDIT),
      },
      {
        // Ver detalle de ficha de ingreso
        path: "ficha-ingreso/detail/:idFichaIngreso",
        element: <FichaDetail />,
        loader: protect(PERMISSIONS.FICHA_INGRESO_VIEW),
      },
      {
        // Crear ficha de servicio
        path: "ficha-servicio",
        element: <FichaServicioForm />,
        loader: protect(PERMISSIONS.FICHA_SERVICIO_CREATE),
      },
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
