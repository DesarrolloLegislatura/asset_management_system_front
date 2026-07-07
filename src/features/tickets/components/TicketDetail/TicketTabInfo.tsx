import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import type {
  Priority,
  ProviderCompany,
  ServiceType,
  TaskCategory,
  Ticket,
  TicketStatus,
} from "../../types";

interface TicketTabInfoProps {
  ticket: Ticket;
  statuses: TicketStatus[];
  priorities: Priority[];
  serviceTypes: ServiceType[];
  taskCategories: TaskCategory[];
  companies: ProviderCompany[];
}

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div>
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="text-sm">{children}</p>
  </div>
);

export const TicketTabInfo = ({
  ticket,
  statuses,
  priorities,
  serviceTypes,
  taskCategories,
  companies,
}: TicketTabInfoProps) => {
  const statusName =
    statuses.find((status) => status.id === ticket.global_status)?.name ??
    "Sin estado";
  const priorityName =
    priorities.find((priority) => priority.id === ticket.priority)?.name ??
    "—";
  const serviceTypeName =
    serviceTypes.find((type) => type.id === ticket.service_type)?.name ??
    "—";
  const categoryName =
    taskCategories.find((category) => category.id === ticket.category)
      ?.name ?? "—";
  const companyName =
    companies.find((company) => company.id === ticket.company)?.name ?? "—";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
      <Field label="N° de ticket externo">
        {ticket.external_ticket_number || "—"}
      </Field>
      <Field label="Acto simple">{ticket.simple_action_number || "—"}</Field>
      <Field label="Estado">{statusName}</Field>
      <Field label="Prioridad">{priorityName}</Field>
      <Field label="Tipo de servicio">{serviceTypeName}</Field>
      <Field label="Categoría">{categoryName}</Field>
      <Field label="Empresa">{companyName}</Field>
      <Field label="Fecha de apertura">
        {formatDateTime(ticket.external_opening_date)}
      </Field>
      <Field label="Fecha de cierre">
        {formatDateTime(ticket.external_closing_date)}
      </Field>
      <Field label="Activo">{ticket.active ? "Sí" : "No"}</Field>
      <Field label="Descripción">{ticket.description || "—"}</Field>
      <Field label="Contexto">{ticket.context || "—"}</Field>
      {ticket.direct_ticket_url && (
        <Field label="Enlace directo">
          <a
            href={ticket.direct_ticket_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Abrir ticket externo <ExternalLink className="h-3 w-3" />
          </a>
        </Field>
      )}
    </div>
  );
};
