import { useEffect, useState, lazy } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { useAuthStore } from "@/store/authStore";
import { FichaDetailTable } from "./FichaDetailTable";
import { LoadingPage } from "../Pages/LoadingPage";
import NotFound from "../Pages/NotFoundPage";

const FichaTecnicaPrint = lazy(() =>
  import("../FichaTecnica/FichaTecnicaPrint").then((module) => ({
    default: module.FichaTecnicaPrint,
  }))
);
const FichaIngresoPrint = lazy(() =>
  import("../FichaIngreso/FichaIngresoPrint").then((module) => ({
    default: module.FichaIngresoPrint,
  }))
);

export const FichaDetail = () => {
  const { idFichaIngreso } = useParams();
  const navigate = useNavigate();
  const group = useAuthStore((state) => state.user.group);
  const { fichaTecnicaById, fetchByIdFichaTecnica, loading, error } =
    useFichaTecnica(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFicha = async () => {
      if (!idFichaIngreso) {
        setIsLoading(false);
        return;
      }
      try {
        await fetchByIdFichaTecnica(+idFichaIngreso);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFicha();
  }, [idFichaIngreso, fetchByIdFichaTecnica]);

  const handlerEdit = () => {
    if (group === "Administrador" || group === "Admin" || group === "Tecnico") {
      navigate(`/ficha-tecnica/${idFichaIngreso}`);
    } else if (group === "Administrativo") {
      navigate(`/ficha-ingreso/${idFichaIngreso}`);
    }
  };

  // Loading State
  if (isLoading || loading)
    return <LoadingPage mensaje="Cargando datos de la ficha..." />;

  // Error State
  if (error || !fichaTecnicaById) {
    return <NotFound />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Detalle de Ficha N°
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Registro de ficha de ingreso{" "}
              {fichaTecnicaById.date_in
                ? ` • ${new Date(fichaTecnicaById.date_in).toLocaleDateString(
                    "es-ES",
                    { day: "2-digit", month: "2-digit", year: "numeric" }
                  )}`
                : ""}
            </p>
          </div>
          <div className="flex gap-2 self-end">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Volver
            </Button>
            <Button variant="outline" size="sm" onClick={handlerEdit}>
              <Pencil className="h-4 w-4 mr-2" /> Editar
            </Button>
            <FichaIngresoPrint fichaTecnicaById={fichaTecnicaById} />
            {fichaTecnicaById.status_users[0].status.name.toLowerCase() !==
              "ingresado" &&
              fichaTecnicaById.status_users[0].status.name.toLowerCase() !==
                "en espera de repuesto" &&
              fichaTecnicaById.status_users[0].status.name.toLowerCase() !==
                "en reparacion" &&
              fichaTecnicaById.status_users[0].status.name.toLowerCase() !==
                "diagnóstico pendiente" && (
                <FichaTecnicaPrint fichaTecnicaById={fichaTecnicaById} />
              )}
          </div>
        </div>
        <FichaDetailTable fichaTecnicaById={fichaTecnicaById} group={group} />
      </div>
    </div>
  );
};
