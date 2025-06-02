import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS, USER_GROUPS } from "@/constants/permissions";
import { Shield, Check, X, Info } from "lucide-react";

/**
 * Ejemplo que muestra cómo funciona el sistema de rutas protegidas
 */
export const RoutesExample = () => {
  const { userGroup, hasPermission } = usePermission();

  const routes = [
    {
      path: "/",
      name: "Lista de Fichas de Ingreso",
      permission: PERMISSIONS.FICHA_INGRESO_VIEW,
      description: "Página principal con la lista de fichas de ingreso",
    },
    {
      path: "/ficha-ingreso",
      name: "Crear Ficha de Ingreso",
      permission: PERMISSIONS.FICHA_INGRESO_CREATE,
      description: "Formulario para crear nueva ficha de ingreso",
    },
    {
      path: "/ficha-ingreso/:id",
      name: "Editar Ficha de Ingreso",
      permission: PERMISSIONS.FICHA_INGRESO_EDIT,
      description: "Formulario para editar ficha de ingreso existente",
    },
    {
      path: "/ficha-ingreso/detail/:id",
      name: "Ver Detalle Ficha de Ingreso",
      permission: PERMISSIONS.FICHA_INGRESO_VIEW,
      description: "Vista de solo lectura de ficha de ingreso",
    },
    {
      path: "/ficha-tecnica/:id",
      name: "Editar Ficha Técnica",
      permission: PERMISSIONS.TECHNICAL_SHEET_EDIT,
      description:
        "Actualizar ficha técnica desde una ficha de ingreso existente",
      special: true,
    },
    {
      path: "/ficha-tecnica/detail/:id",
      name: "Ver Detalle Ficha Técnica",
      permission: PERMISSIONS.TECHNICAL_SHEET_VIEW,
      description: "Vista de solo lectura de ficha técnica",
    },
    {
      path: "/ficha-toner",
      name: "Ficha Toner",
      permission: PERMISSIONS.FICHA_TONER_VIEW,
      description: "Gestión de fichas de toner",
    },
    {
      path: "/inventory",
      name: "Inventario",
      permission: PERMISSIONS.INVENTORY_VIEW,
      description: "Búsqueda y visualización de inventario",
    },
  ];

  const groupAccess = {
    [USER_GROUPS.ADMINISTRADOR]: "Acceso completo a todas las rutas",
    [USER_GROUPS.TECNICO]:
      "Acceso a fichas técnicas, ingreso, toner e inventario",
    [USER_GROUPS.ADMINISTRATIVO]:
      "Acceso limitado a fichas de ingreso, toner e inventario",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sistema de Rutas Protegidas
          </CardTitle>
          <CardDescription>
            Grupo actual:{" "}
            <Badge variant="outline">{userGroup || "Sin grupo"}</Badge>
            <br />
            {groupAccess[userGroup] || "Sin acceso definido"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Nota especial sobre fichas técnicas */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-800 mb-1">
                    Nota importante sobre Fichas Técnicas:
                  </p>
                  <p className="text-amber-700">
                    Las fichas técnicas{" "}
                    <strong>no se crean independientemente</strong>. Solo pueden
                    actualizar/continuar fichas de ingreso previamente creadas.
                    Para crear una ficha técnica, primero debe existir una ficha
                    de ingreso.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {routes.map((route) => {
                const hasAccess = hasPermission(route.permission);

                return (
                  <div
                    key={route.path}
                    className={`border rounded-lg p-4 ${
                      hasAccess
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    } ${route.special ? "border-blue-200 bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {hasAccess ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {route.path}
                          </code>
                          {route.special && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-100"
                            >
                              Solo edición
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm">{route.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {route.description}
                        </p>
                      </div>
                      <Badge
                        variant={hasAccess ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {route.permission}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">ℹ️ Cómo funciona:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Cada ruta está protegida por un permiso específico</li>
                <li>• Los permisos se asignan según el grupo del usuario</li>
                <li>
                  • Si no tienes el permiso, serás redirigido a /unauthorized
                </li>
                <li>
                  • El componente ProtectedRoute maneja toda la lógica de
                  verificación
                </li>
                <li>
                  • Las fichas técnicas requieren una ficha de ingreso previa
                </li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">
                🔒 Configuración de Grupos:
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <Badge className="mr-2">{USER_GROUPS.ADMINISTRADOR}</Badge>
                  <span>Todos los permisos</span>
                </div>
                <div>
                  <Badge variant="secondary" className="mr-2">
                    {USER_GROUPS.TECNICO}
                  </Badge>
                  <span>
                    Fichas técnicas + Fichas de ingreso + Toner + Inventario
                  </span>
                </div>
                <div>
                  <Badge variant="outline" className="mr-2">
                    {USER_GROUPS.ADMINISTRATIVO}
                  </Badge>
                  <span>Solo Fichas de ingreso + Toner + Inventario</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
