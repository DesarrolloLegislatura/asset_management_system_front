import { ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

export const FichaTabEstados = ({ fichaTecnicaById }) => {
  return (
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
            {fichaTecnicaById.status_users.length > 0 ? (
              fichaTecnicaById.status_users.map((stateUser, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-md border border-border/60"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Estado #{fichaTecnicaById.status_users.length - index}
                    </span>
                    <span className="font-medium text-sm">
                      {stateUser.status.name}
                    </span>
                  </div>
                  {/* Usuario que realizo el estado */}
                  <div className="flex flex-col">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Usuario
                      </span>
                    </div>

                    <span className="text-sm font-medium">
                      {stateUser.users.username}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Fecha
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {stateUser.createdat
                        ? new Date(stateUser.createdat).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )
                        : "-"}
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
  );
};
