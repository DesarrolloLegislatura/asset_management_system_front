import { lazy, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Pencil, Computer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { useAuthStore } from "@/store/authStore";
import { FichaTecnicaPrint } from "../FichaTecnica/FichaTecnicaPrint";
const FichaIngresoPrint = lazy(async () => {
  const module = await import("./FichaIngresoPrint");
  return { default: module.FichaIngresoPrint };
});

import NotFound from "../Error/NotFound";
import { FichaDetail } from "../FichaDetail/FichaDetail";

export const FichaIngresoDetail = () => {
  const { idFichaIngreso } = useParams();
  const navigate = useNavigate();
  const group = useAuthStore((state) => state.user.group);
  const { fichaTecnicaById, fetchByIdFichaTecnica, loading, error } =
    useFichaTecnica(false); // Ahora pasamos false para no hacer autoFetch
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
    if (group === "Tecnico") {
      navigate(`/ficha-tecnica/${idFichaIngreso}`);
    } else if (group === "Administrativo") {
      navigate(`/ficha-ingreso/${idFichaIngreso}`);
    } else if (group === "Admin") {
      navigate(`/ficha-tecnica/${idFichaIngreso}`);
    }
  };

  // Loading State
  if (isLoading || loading)
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">
            Cargando ficha de ingreso...
          </p>
        </div>
      </div>
    );

  // Error State
  if (error || !fichaTecnicaById) return <NotFound />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Computer className="h-6 w-6 text-primary" />
              Ficha Técnica
              <Badge variant="outline" className="ml-2 text-sm">
                #{fichaTecnicaById.id}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Registro de ficha técnica
              {fichaTecnicaById.date_in && ` • ${fichaTecnicaById.date_in}`}
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
            {fichaTecnicaById.status_users[0].status.name === "Retirado" && (
              <FichaTecnicaPrint fichaTecnicaById={fichaTecnicaById} />
            )}
          </div>
        </div>

        <FichaDetail fichaTecnicaById={fichaTecnicaById} />
      </div>
    </div>
  );
};
