import { ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export const ResolucionTecnicaTab = ({ fichaTecnicaById }) => {
  return (
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
  );
};
