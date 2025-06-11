import { Filter, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import PropTypes from "prop-types";
export const FichaListFilter = ({
  hasActiveFilters,
  clearAllFilters,
  inventoryFilter,
  setInventoryFilter,
  clearInventoryFilter,
  statusFilter,
  setStatusFilter,
  clearStatusFilter,
  availableStatuses,
  filteredData,
}) => {
  return (
    <>
      {/* Filtros de búsqueda */}
      <div className="mb-6 space-y-4">
        {/* Título de filtros */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros</span>
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar todo
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro por número de inventario */}
          <div className="flex-1 max-w-sm">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Número de Inventario
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por N° de Inventario..."
                value={inventoryFilter}
                onChange={(e) => setInventoryFilter(e.target.value)}
                className="pl-9 pr-9"
              />
              {inventoryFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearInventoryFilter}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Filtro por estado - CORREGIDO */}
          <div className="flex-1 max-w-sm">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Estado
            </label>
            <div className="relative">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {statusFilter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearStatusFilter}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted z-10"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Información de resultados - Actualizar lógica */}
        {hasActiveFilters && (
          <div className="text-sm text-muted-foreground">
            <span>Mostrando {filteredData.length} resultado(s)</span>
            {inventoryFilter && <span> • Inventario: {inventoryFilter}</span>}
            {statusFilter !== "all" && <span> • Estado: {statusFilter}</span>}
          </div>
        )}
      </div>
    </>
  );
};

FichaListFilter.propTypes = {
  hasActiveFilters: PropTypes.bool.isRequired,
  clearAllFilters: PropTypes.func.isRequired,
  inventoryFilter: PropTypes.string.isRequired,
  setInventoryFilter: PropTypes.func.isRequired,
  clearInventoryFilter: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  clearStatusFilter: PropTypes.func.isRequired,
  availableStatuses: PropTypes.array.isRequired,
  filteredData: PropTypes.array.isRequired,
};
