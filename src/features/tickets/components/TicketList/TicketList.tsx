import { useMemo, useState } from "react";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { usePermissions } from "@/shared/auth/usePermissions";
import { PERMISSIONS } from "@/shared/auth/permissions";
import { useTickets } from "../../hooks/useTickets";
import { useTicketStatuses } from "../../hooks/useTicketStatuses";
import { usePriorities, useProviderCompanies } from "../../hooks/useCatalogs";
import type { Ticket } from "../../types";
import { TicketListFilter } from "./TicketListFilter";
import { TicketListTable } from "./TicketListTable";
import { TicketListPaginate } from "./TicketListPaginate";

const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const TicketList = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const { data: tickets = [], isLoading, isFetching, refetch } = useTickets();
  const { data: statuses = [] } = useTicketStatuses();
  const { data: priorities = [] } = usePriorities();
  const { data: companies = [] } = useProviderCompanies();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "external_opening_date", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const statusNameById = useMemo(
    () => new Map(statuses.map((status) => [status.id, status.name])),
    [statuses]
  );
  const priorityNameById = useMemo(
    () => new Map(priorities.map((priority) => [priority.id, priority.name])),
    [priorities]
  );
  const companyNameById = useMemo(
    () => new Map(companies.map((company) => [company.id, company.name])),
    [companies]
  );

  const filteredTickets = useMemo(() => {
    if (statusFilter === "all") return tickets;
    return tickets.filter(
      (ticket) => String(ticket.global_status) === statusFilter
    );
  }, [tickets, statusFilter]);

  const hasActiveFilters = statusFilter !== "all" || globalFilter !== "";

  const clearAllFilters = () => {
    setGlobalFilter("");
    setStatusFilter("all");
  };

  const columns = useMemo<ColumnDef<Ticket>[]>(
    () => [
      {
        accessorKey: "external_ticket_number",
        header: "N° Externo",
        cell: ({ getValue }) => getValue<string>() || "—",
      },
      {
        accessorKey: "general_title",
        header: "Título",
      },
      {
        id: "status",
        accessorFn: (ticket) =>
          statusNameById.get(ticket.global_status ?? -1) ?? "Sin estado",
        header: "Estado",
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
      },
      {
        id: "priority",
        accessorFn: (ticket) =>
          priorityNameById.get(ticket.priority ?? -1) ?? "—",
        header: "Prioridad",
      },
      {
        id: "company",
        accessorFn: (ticket) => companyNameById.get(ticket.company) ?? "—",
        header: "Empresa",
      },
      {
        accessorKey: "external_opening_date",
        header: "Fecha apertura",
        cell: ({ getValue }) => formatDate(getValue<string>()),
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/tickets/detail/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [statusNameById, priorityNameById, companyNameById, navigate]
  );

  const table = useReactTable({
    data: filteredTickets,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de tickets externos
          </p>
        </div>
        {hasPermission(PERMISSIONS.TICKET_CREATE) && (
          <Button onClick={() => navigate("/tickets/new")}>
            <Plus className="h-4 w-4 mr-2" /> Nuevo ticket
          </Button>
        )}
      </div>

      <TicketListFilter
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        availableStatuses={statuses}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
        resultCount={table.getFilteredRowModel().rows.length}
      />

      <TicketListTable
        table={table}
        columnsCount={columns.length}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
        onCreateTicket={() => navigate("/tickets/new")}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      <TicketListPaginate
        table={table}
        filteredCount={filteredTickets.length}
        totalCount={tickets.length}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};
