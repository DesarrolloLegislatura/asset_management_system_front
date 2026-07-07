import { Filter, Search, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { TicketStatus } from "../../types";

interface TicketListFilterProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  availableStatuses: TicketStatus[];
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  resultCount: number;
}

export const TicketListFilter = ({
  globalFilter,
  setGlobalFilter,
  statusFilter,
  setStatusFilter,
  availableStatuses,
  hasActiveFilters,
  clearAllFilters,
  resultCount,
}: TicketListFilterProps) => {
  return (
    <div className="mb-6 space-y-4">
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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-sm">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por título, N° externo..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-9 pr-9"
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGlobalFilter("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

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
                  <SelectItem key={status.id} value={String(status.id)}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {statusFilter !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter("all")}
                className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted z-10"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          <span>Mostrando {resultCount} resultado(s)</span>
        </div>
      )}
    </div>
  );
};
