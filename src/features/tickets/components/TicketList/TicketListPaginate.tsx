import type { Table as TableInstance } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { Ticket } from "../../types";

interface TicketListPaginateProps {
  table: TableInstance<Ticket>;
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
}

export const TicketListPaginate = ({
  table,
  filteredCount,
  totalCount,
  hasActiveFilters,
}: TicketListPaginateProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          Página{" "}
          <span className="font-medium">
            {table.getState().pagination.pageIndex + 1}
          </span>{" "}
          de <span className="font-medium">{table.getPageCount() || 1}</span>
        </span>
        <span className="text-muted-foreground">
          {hasActiveFilters ? (
            <>
              Filtrado: <span className="font-medium">{filteredCount}</span>{" "}
              de <span className="font-medium">{totalCount}</span>
            </>
          ) : (
            <>
              Total: <span className="font-medium">{totalCount}</span> tickets
            </>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
