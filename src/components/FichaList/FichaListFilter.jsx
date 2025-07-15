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
  fichaNumberFilter,
  setFichaNumberFilter,
  clearFichaNumberFilter,
  areaFilter,
  setAreaFilter,
  clearAreaFilter,
  availableAreas,
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

        {/* Primera fila de filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro por Numero de Ficha el cual es el ID de la ficha */}
          <div className="flex-1 max-w-sm">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Número de Ficha
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por N° de Ficha..."
                value={fichaNumberFilter}
                onChange={(e) => setFichaNumberFilter(e.target.value)}
                className="pl-9 pr-9"
              />
              {fichaNumberFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFichaNumberFilter}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

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

          {/* Filtro por estado */}
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

        {/* Segunda fila de filtros - Solo área */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* NUEVO: Filtro por área */}
          <div className="flex-1 max-w-sm">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Área
            </label>
            <div className="relative">
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  {availableAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {areaFilter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAreaFilter}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted z-10"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Espacios vacíos para mantener la alineación */}
          <div className="flex-1 max-w-sm"></div>
          <div className="flex-1 max-w-sm"></div>
        </div>

        {/* Información de resultados - Actualizar lógica */}
        {hasActiveFilters && (
          <div className="text-sm text-muted-foreground">
            <span>Mostrando {filteredData.length} resultado(s)</span>
            {fichaNumberFilter && <span> • N° Ficha: {fichaNumberFilter}</span>}
            {inventoryFilter && <span> • Inventario: {inventoryFilter}</span>}
            {statusFilter !== "all" && <span> • Estado: {statusFilter}</span>}
            {areaFilter !== "all" && <span> • Área: {areaFilter}</span>}
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
  fichaNumberFilter: PropTypes.string.isRequired,
  setFichaNumberFilter: PropTypes.func.isRequired,
  clearFichaNumberFilter: PropTypes.func.isRequired,
  areaFilter: PropTypes.string.isRequired,
  setAreaFilter: PropTypes.func.isRequired,
  clearAreaFilter: PropTypes.func.isRequired,
  availableAreas: PropTypes.array.isRequired,
};
