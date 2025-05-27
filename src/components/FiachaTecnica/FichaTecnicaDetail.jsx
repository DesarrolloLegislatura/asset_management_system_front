import { useEffect, useRef, useState } from "react";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { FichaTecnicaPrint } from "./FichaTecnicaPrint";
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
  ScissorsLineDashed,
  Computer,
  Building2,
  MessageSquare,
  ClipboardCheck,
  Thermometer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Hammer,
  FileClock,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

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

  // Get state badge color based on estado_del_bien
  const getStateBadge = (state) => {
    if (!state) return <Badge variant="outline">Sin estado</Badge>;

    const stateMap = {
      "en reparacion": {
        variant: "secondary",
        icon: <Thermometer className="h-3 w-3 mr-1" />,
        text: "En reparación",
      },
      "espera repuestos": {
        variant: "outline",
        icon: <Clock className="h-3 w-3 mr-1" />,
        text: "Esperando repuestos",
      },
      diagnostico: {
        variant: "outline",
        icon: <FileClock className="h-3 w-3 mr-1" />,
        text: "Diagnóstico pendiente",
      },
      reparado: {
        variant: "success",
        icon: <Hammer className="h-3 w-3 mr-1" />,
        text: "Reparado",
      },
      "listo entregar": {
        variant: "success",
        icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
        text: "Listo para entregar",
      },
      "no reparable": {
        variant: "destructive",
        icon: <AlertTriangle className="h-3 w-3 mr-1" />,
        text: "No reparable",
      },
      "reparacion externa": {
        variant: "secondary",
        icon: <Building2 className="h-3 w-3 mr-1" />,
        text: "En reparación externa",
      },
    };

    const stateInfo = stateMap[state.toLowerCase()] || {
      variant: "outline",
      icon: null,
      text: state,
    };

    return (
      <Badge
        variant={stateInfo.variant}
        className="capitalize flex items-center text-sm"
      >
        {stateInfo.icon}
        {stateInfo.text}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="print:hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Computer className="h-6 w-6 text-primary" />
              Ficha Técnica
              <Badge variant="outline" className="ml-2 text-sm">
                #{fichaTecnicaById.id_ficha_tecnica}
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

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="info">Información General</TabsTrigger>
            <TabsTrigger value="tech">Resolución Técnica</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Computer className="h-5 w-5 text-primary" />
                  Información del Bien
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Estado
                      </span>
                      <div>
                        {getStateBadge(fichaTecnicaById.estado_del_bien)}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Tipo de Bien
                      </span>
                      <span className="capitalize">
                        {fichaTecnicaById.tipo_de_bien || "-"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Número de Patrimonio
                      </span>
                      <span>{fichaTecnicaById.numero_patrimonio || "-"}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Medio de Solicitud
                      </span>
                      <span className="capitalize">
                        {fichaTecnicaById.medio_solicitud || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Dependencia
                      </span>
                      <span>
                        {fichaTecnicaById.dependencia_interna?.dependencia
                          ?.dep_gral || "-"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Dependencia Interna
                      </span>
                      <span>
                        {fichaTecnicaById.dependencia_interna?.dep_interna ||
                          "-"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Actuación Simple
                      </span>
                      <span>
                        {fichaTecnicaById.act_simple
                          ? `${fichaTecnicaById.act_simple}/${
                              fichaTecnicaById.anio_act_simple || ""
                            }`
                          : "-"}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Fecha Ingreso
                      </span>
                      <span>{fichaTecnicaById.fecha_de_ingreso || "-"}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Usuario PC
                    </span>
                    <span>{fichaTecnicaById.usuario_pc || "-"}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Contraseña PC
                    </span>
                    <span>{fichaTecnicaById.contrasenia_pc || "-"}</span>
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
                    {fichaTecnicaById.descripcion_user ||
                      "Sin descripción proporcionada."}
                  </p>
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
                      Asistido por
                    </span>
                    <span className="font-medium">
                      {fichaTecnicaById.asistido || "-"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Ponderación
                    </span>
                    <span className="font-medium">
                      {fichaTecnicaById.ponderacion || "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                    Descripción de la Resolución
                  </span>
                  <div className="bg-muted/30 p-4 rounded-md border border-border/60">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {fichaTecnicaById.descripcion_tec ||
                        "Sin resolución técnica registrada."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Content for printing - hidden on screen */}
      <div className="hidden print:block" ref={contentRef}>
        <FichaTecnicaPrint fichaTecnicaById={fichaTecnicaById} />
        <div className="w-full flex items-center justify-center my-4">
          <ScissorsLineDashed className="h-6 w-6" color="#6a7282" />
          <div className="border-t-2 border-dashed border-gray-500 flex-grow mx-2"></div>
          <ScissorsLineDashed
            className="h-6 w-6 transform rotate-180"
            color="#6a7282"
          />
        </div>
        <FichaTecnicaPrint fichaTecnicaById={fichaTecnicaById} />
      </div>
    </div>
  );
};
