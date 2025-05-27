// Crear la ruta para el componente

import { createBrowserRouter } from "react-router";
import { AuthLayout } from "../layouts/AuthLayout.jsx";
import { MainLayout } from "../layouts/MainLayout";
import { LoginForm } from "../components/Auth/LoginForm.jsx";
import { FichaTecnicaForm } from "@/components/FiachaTecnica/FichaTecnicaForm.jsx";
import { AuthGuard } from "./AuthGuard.jsx";
import { GroupsGuard } from "./GroupsGuard.jsx";
import { FichaTonerForm } from "@/components/FichaToner/FichaTonerForm.jsx";
import { FichaIngresoForm } from "@/components/FichaIngreso/FichaIngresoForm.jsx";
import { FichaIngresoList } from "@/components/FichaIngreso/FichaIngresoList.jsx";
import NotFound from "@/components/Error/NotFound.jsx";
import { FichaIngresoDetail } from "@/components/FichaIngreso/FichaIngresoDetail.jsx";
import { FichaTecnicaDetail } from "@/components/FiachaTecnica/FichaTecnicaDetail.jsx";
import Unauthorized from "@/components/Auth/Unauthorized.jsx";

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
    // errror 404
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
        index: true,
        element: (
          <GroupsGuard allowedGroups={["Admin", "Tecnico", "Administrativo"]}>
            <FichaIngresoList />
          </GroupsGuard>
        ),
      },
      {
        path: "ficha-tecnica",
        element: (
          <GroupsGuard allowedGroups={["Admin", "Tecnico"]}>
            <FichaTecnicaForm />
          </GroupsGuard>
        ),
      },
      {
        path: "ficha-tecnica/:idFichaIngreso",
        element: (
          <GroupsGuard allowedGroups={["Admin", "Tecnico"]}>
            <FichaTecnicaForm />
          </GroupsGuard>
        ),
      },
      {
        path: "ficha-tecnica/detail/:idFichaIngreso",
        element: (
          <GroupsGuard allowedGroups={["Admin", "Tecnico"]}>
            <FichaTecnicaDetail />
          </GroupsGuard>
        ),
      },
      {
        path: "ficha-ingreso",
        element: (
          <GroupsGuard allowedGroups={["Admin", "Administrativo"]}>
            <FichaIngresoForm />
          </GroupsGuard>
        ),
      },
      {
        path: "ficha-ingreso/:idFichaIngreso",
        element: (
          <GroupsGuard allowedGroups={["Admin", "Administrativo"]}>
            <FichaIngresoForm />
          </GroupsGuard>
        ),
      },
      {
        path: "ficha-ingreso/detail/:idFichaIngreso",
        element: (
          <GroupsGuard allowedGroups={["Admin", "Administrativo"]}>
            <FichaIngresoDetail />
          </GroupsGuard>
        ),
      },
      {
        path: "ficha-toner",
        element: (
          <GroupsGuard allowedGroups={["Admin", "Tecnico", "Administrativo"]}>
            <FichaTonerForm />
          </GroupsGuard>
        ),
      },
    ],
  },
  {
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
