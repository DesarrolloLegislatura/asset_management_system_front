import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Computer, AlertTriangle } from "lucide-react";
import { FichaTecnicaPrint } from "./FichaTecnicaPrint";
import { useAuthStore } from "@/store/authStore";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { FichaDetail } from "../FichaDetail/FichaDetail";

export const FichaTecnicaDetail = () => {
  const { idFichaIngreso } = useParams();
  const contentRef = useRef(null);
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
    if (group === "Tecnico") {
      navigate(`/ficha-tecnica/${idFichaIngreso}`);
    } else if (group === "Administrativo") {
      navigate(`/ficha-ingreso/${idFichaIngreso}`);
    } else if (group === "Admin") {
      navigate(`/ficha-tecnica/${idFichaIngreso}`);
    }
  };

  if (isLoading || loading)
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">
            Cargando ficha técnica...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <Card className="max-w-4xl mx-auto border-destructive/30 bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Error al cargar los datos
          </CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
        </CardFooter>
      </Card>
    );

  if (!fichaTecnicaById)
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            No se encontró la ficha
          </CardTitle>
          <CardDescription>
            La ficha técnica solicitada no existe o ha sido eliminada
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
        </CardFooter>
      </Card>
    );

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
              Registro de servicio técnico
              {fichaTecnicaById.fecha_de_ingreso &&
                ` • ${fichaTecnicaById.fecha_de_ingreso}`}
            </p>
          </div>
          <div className="flex gap-2 self-end">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Volver
            </Button>
            <Button variant="outline" size="sm" onClick={handlerEdit}>
              <Pencil className="h-4 w-4 mr-2" /> Editar
            </Button>
            <FichaTecnicaPrint fichaTecnicaById={fichaTecnicaById} />
          </div>
        </div>
      </div>

      <FichaDetail fichaTecnicaById={fichaTecnicaById} />
    </div>
  );
};
