import type { RouteObject } from "react-router";
import { protect } from "@/shared/auth/guards";
import { PERMISSIONS } from "@/shared/auth/permissions";
import { FichaList } from "./components/FichaList/FichaList";
import { FichaTecnicaForm } from "./components/FichaTecnica/FichaTecnicaForm";
import { FichaDetail } from "./components/FichaDetail/FichaDetail";
import { FichaIngresoForm } from "./components/FichaIngreso/FichaIngresoForm";
import { FichaServicioForm } from "./components/FichaServicio/FichaServicioForm";

export const fichasRoutes: RouteObject[] = [
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
];
