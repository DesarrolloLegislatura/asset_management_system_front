import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import PropTypes from "prop-types";

export const FichaListPaginate = ({
  table,
  filteredData,
  hasActiveFilters,
  fichasTecnicas,
}) => {
  return (
    <>
      {/* Paginación actualizada */}
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
            de <span className="font-medium">{table.getPageCount()}</span>
          </span>
          <span className="text-muted-foreground">
            {hasActiveFilters ? (
              <>
                Filtrado:{" "}
                <span className="font-medium">{filteredData.length}</span> de{" "}
                <span className="font-medium">
                  {fichasTecnicas?.length || 0}
                </span>
              </>
            ) : (
              <>
                Total:{" "}
                <span className="font-medium">
                  {fichasTecnicas?.length || 0}
                </span>{" "}
                fichas
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
    </>
  );
};

FichaListPaginate.propTypes = {
  table: PropTypes.object.isRequired,
  filteredData: PropTypes.array.isRequired,
  hasActiveFilters: PropTypes.bool.isRequired,
  fichasTecnicas: PropTypes.array,
};
