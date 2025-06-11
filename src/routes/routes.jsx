import { createBrowserRouter } from "react-router";
import { AuthLayout } from "../layouts/AuthLayout.jsx";
import { MainLayout } from "../layouts/MainLayout";
import { LoginForm } from "../components/Auth/LoginForm.jsx";
import { FichaTecnicaForm } from "@/components/FichaTecnica/FichaTecnicaForm.jsx";
import { AuthGuard } from "../components/Auth/AuthGuard.jsx";
import { FichaIngresoForm } from "@/components/FichaIngreso/FichaIngresoForm.jsx";
// import { FichaIngresoList } from "@/components/FichaIngreso/FichaIngresoList.jsx";
import NotFound from "@/components/Error/NotFound.jsx";
import { FichaIngresoDetail } from "@/components/FichaIngreso/FichaIngresoDetail.jsx";
import { FichaTecnicaDetail } from "@/components/FichaTecnica/FichaTecnicaDetail.jsx";
import { Unauthorized } from "@/components/Error/Unauthorized.jsx";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute.jsx";
import { PERMISSIONS } from "@/constants/permissions.js";
import { FichaList } from "@/components/FichaList/FichaList.jsx";

const routes = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginForm />,
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
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        // Página principal - Lista de Fichas de Ingreso
        index: true,
        element: (
          <ProtectedRoute permission={PERMISSIONS.FICHA_INGRESO_VIEW}>
            <FichaList />
          </ProtectedRoute>
        ),
      },

      {
        // Editar ficha técnica (desde una ficha de ingreso existente)
        path: "ficha-tecnica/:idFichaIngreso",
        element: (
          <ProtectedRoute permission={PERMISSIONS.TECHNICAL_SHEET_EDIT}>
            <FichaTecnicaForm />
          </ProtectedRoute>
        ),
      },
      {
        // Ver detalle de ficha técnica
        path: "ficha-tecnica/detail/:idFichaIngreso",
        element: (
          <ProtectedRoute permission={PERMISSIONS.TECHNICAL_SHEET_VIEW}>
            <FichaTecnicaDetail />
          </ProtectedRoute>
        ),
      },
      {
        // Crear nueva ficha de ingreso
        path: "ficha-ingreso",
        element: (
          <ProtectedRoute permission={PERMISSIONS.FICHA_INGRESO_CREATE}>
            <FichaIngresoForm />
          </ProtectedRoute>
        ),
      },
      {
        // Editar ficha de ingreso
        path: "ficha-ingreso/:idFichaIngreso",
        element: (
          <ProtectedRoute permission={PERMISSIONS.FICHA_INGRESO_EDIT}>
            <FichaIngresoForm />
          </ProtectedRoute>
        ),
      },
      {
        // Ver detalle de ficha de ingreso
        path: "ficha-ingreso/detail/:idFichaIngreso",
        element: (
          <ProtectedRoute permission={PERMISSIONS.FICHA_INGRESO_VIEW}>
            <FichaIngresoDetail />
          </ProtectedRoute>
        ),
      },
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
