import { Computer, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";

export const FichaTabInfoBien = ({ fichaTecnicaById }) => {
  return (
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
                  <p>{fichaTecnicaById.area?.name || "-"}</p>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Fecha Ingreso
                </span>
                <span>
                  {fichaTecnicaById.date_in
                    ? new Date(
                        fichaTecnicaById.date_in + "T12:00:00"
                      ).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Estado
                </span>
                <span>
                  {fichaTecnicaById.status_users.length > 0 && (
                    <p>{fichaTecnicaById.status_users[0].status.name}</p>
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
                  <p>{fichaTecnicaById.asset?.typeasset?.name || "-"}</p>
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Edificio
                </span>
                <span>
                  <p>{fichaTecnicaById.building?.name || "-"}</p>
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Actuación Simple
                </span>
                <span>
                  <p>
                    {fichaTecnicaById.act_simple
                      ? `${fichaTecnicaById.act_simple}/${fichaTecnicaById.year_act_simple}`
                      : "-"}
                  </p>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Medio de Solicitud
                </span>
                <span className="capitalize">
                  <p>{fichaTecnicaById.means_application || "-"}</p>
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
            Descripción del Problema del Usuario
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-muted/30 p-4 rounded-md border border-border/60">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {fichaTecnicaById.user_description || "-"}
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
