import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { InventorySerch } from "@/components/Iventario/InventorySerch";
import { useTheme } from "@/hooks/useTheme";

export function InventoryDemo() {
  const [selectedInventory, setSelectedInventory] = useState("");
  const [typeasset, setTypeasset] = useState("");
  const [area, setArea] = useState("");
  const [building, setBuilding] = useState("");
  const [error, setError] = useState("");
  const { isDark } = useTheme();

  const handleInventoryChange = (value) => {
    setSelectedInventory(value);
    setError(""); // Limpiar error al cambiar

    // Simular validación
    if (value && value.length < 3) {
      setError("El número de inventario debe tener al menos 3 dígitos");
    }
  };

  // // Solo mostrar en desarrollo
  // if (import.meta.env.PROD) {
  //   return null;
  // }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Demo InventorySerch</span>
            <Badge variant={isDark ? "default" : "secondary"}>
              {isDark ? "🌙 Oscuro" : "☀️ Claro"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Componente InventorySerch */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Buscar Inventario:
            </label>
            <InventorySerch
              value={selectedInventory}
              onChange={handleInventoryChange}
              onTypeassetChange={setTypeasset}
              onAreaChange={setArea}
              onBuildingChange={setBuilding}
              error={error}
            />
          </div>

          {/* Información seleccionada */}
          {selectedInventory && (
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-muted rounded text-muted-foreground">
                <div>
                  <strong>Inventario:</strong> {selectedInventory}
                </div>
                {typeasset && (
                  <div>
                    <strong>Tipo:</strong> {typeasset}
                  </div>
                )}
                {area && (
                  <div>
                    <strong>Área:</strong> {area}
                  </div>
                )}
                {building && (
                  <div>
                    <strong>Edificio:</strong> {building}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Estado con error */}
          <div>
            <label className="text-sm font-medium mb-2 block">Con Error:</label>
            <InventorySerch
              value=""
              onChange={() => {}}
              error="Este campo es requerido"
            />
          </div>

          {/* Estado deshabilitado */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Deshabilitado:
            </label>
            <InventorySerch value="12345" onChange={() => {}} disabled={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
