import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export const FichaTabInfoContacto = ({ fichaTecnicaById }) => {
  return (
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
                  {fichaTecnicaById.date_out
                    ? new Date(
                        fichaTecnicaById.date_out + "T12:00:00"
                      ).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Nombre del Retirado
                </span>
                <span className="font-medium">
                  {fichaTecnicaById.retired_by || "-"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
