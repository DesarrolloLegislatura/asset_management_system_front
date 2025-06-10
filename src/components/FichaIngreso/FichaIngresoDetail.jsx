import { useEffect, useState } from "react";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Pencil,
  Computer,
  User,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { FichaIngresoPrint } from "./FichaIngresoPrint";
import { FichaTecnicaPrint } from "../FichaTecnica/FichaTecnicaPrint";
import NotFound from "../Error/NotFound";

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
            {fichaTecnicaById.status[0].name === "Retirado" && (
              <FichaTecnicaPrint fichaTecnicaById={fichaTecnicaById} />
            )}
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-4  w-full mb-10  max-w-2xl m">
            <TabsTrigger value="info">Info del Bien</TabsTrigger>
            <TabsTrigger value="contact">Info de Contacto</TabsTrigger>
            <TabsTrigger value="tech">Resolución Técnica</TabsTrigger>
            <TabsTrigger value="states">Estados</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Computer className="h-5 w-5 text-primary" />
                  Informacion del Equipo
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Número de Inventario
                      </span>
                      <span>{fichaTecnicaById.asset.inventory || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Area
                      </span>
                      <span>
                        <p>
                          {fichaTecnicaById.asset?.area?.name ||
                            "No especificada"}
                        </p>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Fecha Ingreso
                      </span>
                      <span>{fichaTecnicaById.date_in || "-"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Estado
                      </span>
                      <span>
                        {fichaTecnicaById.status?.length > 0 && (
                          <p>{fichaTecnicaById.status[0].name}</p>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Tipo de Bien
                      </span>
                      <span className="capitalize">
                        <p>
                          {fichaTecnicaById.asset?.typeasset?.name ||
                            "No especificado"}
                        </p>
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Edificio
                      </span>
                      <span>
                        <p>
                          {fichaTecnicaById.asset?.building?.name ||
                            "No especificado"}
                        </p>
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Actuación Simple
                      </span>
                      <span>
                        <p>
                          {fichaTecnicaById.act_simple +
                            "/" +
                            fichaTecnicaById.year_act_simple}
                        </p>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Medio de Solicitud
                      </span>
                      <span className="capitalize">
                        <p>
                          {fichaTecnicaById.means_application ||
                            "No especificado"}
                        </p>
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4 ">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Usuario PC
                    </span>
                    <span>{fichaTecnicaById.user_pc || "-"}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Contraseña PC
                    </span>
                    <span>{fichaTecnicaById.pass_pc || "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Descripción del Problema
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-muted/30 p-4 rounded-md border border-border/60">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {fichaTecnicaById.user_description ||
                      "Sin descripción proporcionada."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Nombre Contacto
                      </span>
                      <span className="font-medium">
                        {fichaTecnicaById.contact_name || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Teléfono Contacto
                      </span>
                      <span className="font-medium">
                        {fichaTecnicaById.contact_phone || "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 mt-10">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Fecha de Retiro
                      </span>
                      <span className="font-medium">
                        {fichaTecnicaById.date_out || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Nombre del Retirado
                      </span>
                      <span className="font-medium">
                        {fichaTecnicaById.retire_name || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  Resolución Técnica
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Tipo de Asistencia
                    </span>
                    <span className="font-medium">
                      {fichaTecnicaById.assistance || "Sin Datos"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Ponderación
                    </span>
                    <span className="font-medium">
                      {fichaTecnicaById.asset?.weighting.name || "Sin Datos"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                    Descripción de la Resolución
                  </span>
                  <div className="bg-muted/30 p-4 rounded-md border border-border/60">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {fichaTecnicaById.tech_description || "Sin Datos"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="states" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  Estados
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {fichaTecnicaById.status &&
                  fichaTecnicaById.status.length > 0 ? (
                    fichaTecnicaById.status.map((state, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-md border border-border/60"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Estado #{index + 1}
                          </span>
                          <span className="font-medium text-sm">
                            {state.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              Fecha
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {state.createdat
                              ? new Date(state.createdat).toLocaleDateString(
                                  "es-ES",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )
                              : "Sin fecha"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No hay estados registrados para esta ficha
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
