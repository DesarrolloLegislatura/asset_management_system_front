import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { LoadingPage } from "@/shared/pages/LoadingPage";
import NotFound from "@/shared/pages/NotFoundPage";
import { usePermissions } from "@/shared/auth/usePermissions";
import { PERMISSIONS } from "@/shared/auth/permissions";
import { useTicket } from "../../hooks/useTickets";
import { useTicketStatuses } from "../../hooks/useTicketStatuses";
import {
  usePriorities,
  useProviderCompanies,
  useServiceTypes,
  useTaskCategories,
} from "../../hooks/useCatalogs";
import { TicketTabInfo } from "./TicketTabInfo";
import { TicketStatusDialog } from "./TicketStatusDialog";
import { TicketDeleteDialog } from "./TicketDeleteDialog";
import { TicketTabAdditionalRequests } from "./TicketTabAdditionalRequests";

export const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const ticketId = id ? Number(id) : NaN;

  const { data: ticket, isLoading, error } = useTicket(ticketId);
  const { data: statuses = [] } = useTicketStatuses();
  const { data: priorities = [] } = usePriorities();
  const { data: serviceTypes = [] } = useServiceTypes();
  const { data: taskCategories = [] } = useTaskCategories();
  const { data: companies = [] } = useProviderCompanies();

  if (isLoading) return <LoadingPage mensaje="Cargando ticket..." />;
  if (error || !ticket) return <NotFound />;

  const statusName =
    statuses.find((status) => status.id === ticket.global_status)?.name ??
    "Sin estado";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {ticket.general_title}
            <Badge variant="secondary">{statusName}</Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ticket N° {ticket.id}
            {ticket.external_ticket_number &&
              ` • Externo: ${ticket.external_ticket_number}`}
          </p>
        </div>
        <div className="flex gap-2 self-end">
          <Button variant="outline" size="sm" onClick={() => navigate("/tickets")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
          {hasPermission(PERMISSIONS.TICKET_EDIT) && (
            <>
              <TicketStatusDialog ticket={ticket} statuses={statuses} />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/tickets/edit/${ticket.id}`)}
              >
                <Pencil className="h-4 w-4 mr-2" /> Editar
              </Button>
            </>
          )}
          {hasPermission(PERMISSIONS.TICKET_DELETE) && (
            <TicketDeleteDialog
              ticketId={ticket.id as number}
              ticketTitle={ticket.general_title}
              onDeleted={() => navigate("/tickets")}
            />
          )}
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="requests">Pedidos Adicionales</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <TicketTabInfo
            ticket={ticket}
            statuses={statuses}
            priorities={priorities}
            serviceTypes={serviceTypes}
            taskCategories={taskCategories}
            companies={companies}
          />
        </TabsContent>
        <TabsContent value="requests">
          <TicketTabAdditionalRequests ticketId={ticket.id as number} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
