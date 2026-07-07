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
import { useAuthStore } from "@/shared/auth/authStore";
import { useTicketStatuses } from "../../hooks/useTicketStatuses";
import {
  useCreateTrackingEntry,
  useUpdateTrackingEntry,
} from "../../hooks/useTrackingHistory";
import {
  trackingEntrySchema,
  type TrackingEntryFormValues,
} from "../../schemas/trackingEntrySchema";
import type { TrackingHistoryEntry, TrackingHistoryInput } from "../../types";

interface TrackingEntryFormDialogProps {
  additionalRequestId: number;
  mode: "create" | "edit";
  entry?: TrackingHistoryEntry;
  trigger: ReactNode;
}

const emptyDefaults: TrackingEntryFormValues = {
  event_date: "",
  update_source: "manual",
  comment: "",
  previous_status: "",
  new_status: "",
  active: true,
};

export const TrackingEntryFormDialog = ({
  additionalRequestId,
  mode,
  entry,
  trigger,
}: TrackingEntryFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const { data: statuses = [] } = useTicketStatuses();
  const createEntry = useCreateTrackingEntry(additionalRequestId);
  const updateEntry = useUpdateTrackingEntry(additionalRequestId);
  const isSubmitting = createEntry.isPending || updateEntry.isPending;

  const form = useForm<TrackingEntryFormValues>({
    resolver: zodResolver(trackingEntrySchema),
    defaultValues: emptyDefaults,
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && entry) {
      reset({
        event_date: entry.event_date ? entry.event_date.split("T")[0] : "",
        update_source: entry.update_source ?? "",
        comment: entry.comment ?? "",
        previous_status: entry.previous_status
          ? String(entry.previous_status)
          : "",
        new_status: entry.new_status ? String(entry.new_status) : "",
        active: entry.active ?? true,
      });
    } else {
      reset({
        ...emptyDefaults,
        event_date: new Date().toISOString().split("T")[0],
      });
    }
  }, [open, mode, entry, reset]);

  const onSubmit = async (data: TrackingEntryFormValues) => {
    const payload: TrackingHistoryInput = {
      event_date: data.event_date || null,
      update_source: data.update_source || null,
      comment: data.comment || null,
      previous_status: data.previous_status
        ? Number(data.previous_status)
        : null,
      new_status: Number(data.new_status),
      additional_request: additionalRequestId,
      active: data.active,
      registered_by_user: user.id ? Number(user.id) : null,
    };

    if (mode === "edit" && entry) {
      await updateEntry.mutateAsync({ id: entry.id as number, body: payload });
    } else {
      await createEntry.mutateAsync(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar evento" : "Registrar evento de seguimiento"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="previous_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado anterior</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sin estado anterior" />
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
                name="new_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nuevo estado <span className="text-red-500">*</span>
                    </FormLabel>
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
              name="event_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha del evento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="update_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origen</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: manual, email, teléfono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentario</FormLabel>
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
