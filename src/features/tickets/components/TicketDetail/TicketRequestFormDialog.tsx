import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
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
import { useTicketStatuses } from "../../hooks/useTicketStatuses";
import { usePriorities } from "../../hooks/useCatalogs";
import {
  useCreateAdditionalRequest,
  useUpdateAdditionalRequest,
} from "../../hooks/useAdditionalRequests";
import {
  additionalRequestSchema,
  type AdditionalRequestFormValues,
} from "../../schemas/additionalRequestSchema";
import type { AdditionalRequest, AdditionalRequestInput } from "../../types";

interface TicketRequestFormDialogProps {
  ticketId: number;
  mode: "create" | "edit";
  request?: AdditionalRequest;
  trigger: ReactNode;
}

const emptyDefaults: AdditionalRequestFormValues = {
  sequence: "",
  request_description: "",
  resolution_description: "",
  request_date: "",
  completion_date: "",
  active: true,
  request_status: "",
  priority: "",
  internal_requester: "",
};

export const TicketRequestFormDialog = ({
  ticketId,
  mode,
  request,
  trigger,
}: TicketRequestFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { data: statuses = [] } = useTicketStatuses();
  const { data: priorities = [] } = usePriorities();
  const createRequest = useCreateAdditionalRequest(ticketId);
  const updateRequest = useUpdateAdditionalRequest(ticketId);
  const isSubmitting = createRequest.isPending || updateRequest.isPending;

  const form = useForm<AdditionalRequestFormValues>({
    resolver: zodResolver(additionalRequestSchema),
    defaultValues: emptyDefaults,
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && request) {
      reset({
        sequence: String(request.sequence),
        request_description: request.request_description,
        resolution_description: request.resolution_description ?? "",
        request_date: request.request_date
          ? request.request_date.split("T")[0]
          : "",
        completion_date: request.completion_date
          ? request.completion_date.split("T")[0]
          : "",
        active: request.active ?? true,
        request_status: request.request_status
          ? String(request.request_status)
          : "",
        priority: request.priority ? String(request.priority) : "",
        internal_requester: request.internal_requester
          ? String(request.internal_requester)
          : "",
      });
    } else {
      reset(emptyDefaults);
    }
  }, [open, mode, request, reset]);

  const onSubmit = async (data: AdditionalRequestFormValues) => {
    const payload: AdditionalRequestInput = {
      sequence: Number(data.sequence),
      request_description: data.request_description,
      resolution_description: data.resolution_description || null,
      request_date: data.request_date || null,
      completion_date: data.completion_date || null,
      active: data.active,
      request_status: data.request_status ? Number(data.request_status) : null,
      priority: data.priority ? Number(data.priority) : null,
      parent_ticket: ticketId,
      internal_requester: data.internal_requester
        ? Number(data.internal_requester)
        : null,
    };

    if (mode === "edit" && request) {
      await updateRequest.mutateAsync({ id: request.id as number, body: payload });
    } else {
      await createRequest.mutateAsync(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar pedido adicional" : "Nuevo pedido adicional"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="sequence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Secuencia <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="request_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
            </div>

            <FormField
              control={control}
              name="request_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descripción del pedido <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="flex w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="resolution_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción de resolución</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="flex w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="request_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de pedido</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="completion_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de finalización</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
