import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { LoadingPage } from "@/shared/pages/LoadingPage";
import { useAuthStore } from "@/shared/auth/authStore";
import { useTicket, useCreateTicket, useUpdateTicket } from "../../hooks/useTickets";
import { useTicketStatuses } from "../../hooks/useTicketStatuses";
import {
  usePriorities,
  useProviderCompanies,
  useServiceTypes,
  useTaskCategories,
} from "../../hooks/useCatalogs";
import { ticketSchema, type TicketFormValues } from "../../schemas/ticketSchema";
import type { TicketInput } from "../../types";

const emptyDefaults: TicketFormValues = {
  general_title: "",
  company: "",
  external_ticket_number: "",
  simple_action_number: "",
  description: "",
  context: "",
  direct_ticket_url: "",
  external_opening_date: new Date().toISOString().split("T")[0],
  external_closing_date: "",
  active: true,
  category: "",
  service_type: "",
  global_status: "",
  priority: "",
};

export function TicketForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const ticketId = id ? Number(id) : NaN;
  const user = useAuthStore((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: ticket, isLoading: isLoadingTicket } = useTicket(ticketId);
  const { data: statuses = [], isLoading: loadingStatuses } = useTicketStatuses();
  const { data: priorities = [] } = usePriorities();
  const { data: serviceTypes = [] } = useServiceTypes();
  const { data: taskCategories = [] } = useTaskCategories();
  const { data: companies = [] } = useProviderCompanies();

  const createTicket = useCreateTicket();
  const updateTicket = useUpdateTicket();

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: emptyDefaults,
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!isEditMode || !ticket) return;
    reset({
      general_title: ticket.general_title,
      company: String(ticket.company),
      external_ticket_number: ticket.external_ticket_number ?? "",
      simple_action_number: ticket.simple_action_number ?? "",
      description: ticket.description ?? "",
      context: ticket.context ?? "",
      direct_ticket_url: ticket.direct_ticket_url ?? "",
      external_opening_date: ticket.external_opening_date
        ? ticket.external_opening_date.split("T")[0]
        : "",
      external_closing_date: ticket.external_closing_date
        ? ticket.external_closing_date.split("T")[0]
        : "",
      active: ticket.active ?? true,
      category: ticket.category ? String(ticket.category) : "",
      service_type: ticket.service_type ? String(ticket.service_type) : "",
      global_status: ticket.global_status ? String(ticket.global_status) : "",
      priority: ticket.priority ? String(ticket.priority) : "",
    });
  }, [isEditMode, ticket, reset]);

  const onSubmit = async (data: TicketFormValues) => {
    setIsSubmitting(true);
    const payload: TicketInput = {
      general_title: data.general_title,
      company: Number(data.company),
      external_ticket_number: data.external_ticket_number || null,
      simple_action_number: data.simple_action_number || null,
      description: data.description || null,
      context: data.context || null,
      direct_ticket_url: data.direct_ticket_url || null,
      external_opening_date: data.external_opening_date || null,
      external_closing_date: data.external_closing_date || null,
      active: data.active,
      category: data.category ? Number(data.category) : null,
      service_type: data.service_type ? Number(data.service_type) : null,
      global_status: data.global_status ? Number(data.global_status) : null,
      priority: data.priority ? Number(data.priority) : null,
      registration_agent: user.id ? Number(user.id) : null,
    };

    try {
      if (isEditMode) {
        await updateTicket.mutateAsync({ id: ticketId, body: payload });
        navigate(`/tickets/detail/${ticketId}`);
      } else {
        const created = await createTicket.mutateAsync(payload);
        navigate(`/tickets/detail/${created.id}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoadingTicket) {
    return <LoadingPage mensaje="Cargando datos del ticket..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode ? `Editar Ticket #${id}` : "Nuevo Ticket"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isEditMode
            ? "Edite los campos que desee actualizar"
            : "Complete los campos requeridos para crear el ticket"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos del Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="general_title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Título <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Título general del ticket" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Empresa <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={String(company.id)}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="global_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingStatuses}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.id} value={String(status.id)}>
                              {status.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridad</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una prioridad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.id} value={String(priority.id)}>
                              {priority.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="service_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de servicio</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceTypes.map((type) => (
                            <SelectItem key={type.id} value={String(type.id)}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {taskCategories.map((category) => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="external_ticket_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° de ticket externo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número del sistema externo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="simple_action_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acto simple</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número de acto simple" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="external_opening_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de apertura</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="cursor-pointer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="external_closing_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de cierre</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="cursor-pointer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="direct_ticket_url"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Enlace directo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="flex w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Descripción del ticket"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="context"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Contexto</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="flex w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder="Contexto adicional"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(isEditMode ? `/tickets/detail/${id}` : "/tickets")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
