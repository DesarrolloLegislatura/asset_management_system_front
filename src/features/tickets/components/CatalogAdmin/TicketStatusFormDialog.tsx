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
import {
  useCreateTicketStatus,
  useUpdateTicketStatus,
} from "../../hooks/useTicketStatuses";
import {
  ticketStatusSchema,
  type TicketStatusFormValues,
} from "../../schemas/ticketStatusSchema";
import type { TicketStatus } from "../../types";

interface TicketStatusFormDialogProps {
  mode: "create" | "edit";
  status?: TicketStatus;
  trigger: ReactNode;
}

const emptyDefaults: TicketStatusFormValues = {
  code: "",
  name: "",
  description: "",
  active: true,
};

export const TicketStatusFormDialog = ({
  mode,
  status,
  trigger,
}: TicketStatusFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const createStatus = useCreateTicketStatus();
  const updateStatus = useUpdateTicketStatus();
  const isSubmitting = createStatus.isPending || updateStatus.isPending;

  const form = useForm<TicketStatusFormValues>({
    resolver: zodResolver(ticketStatusSchema),
    defaultValues: emptyDefaults,
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && status) {
      reset({
        code: status.code,
        name: status.name,
        description: status.description ?? "",
        active: status.active ?? true,
      });
    } else {
      reset(emptyDefaults);
    }
  }, [open, mode, status, reset]);

  const onSubmit = async (data: TicketStatusFormValues) => {
    const payload = {
      code: data.code,
      name: data.name,
      description: data.description || null,
      active: data.active,
    };

    if (mode === "edit" && status) {
      await updateStatus.mutateAsync({ id: status.id as number, body: payload });
    } else {
      await createStatus.mutateAsync(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar estado" : "Nuevo estado"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Código <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Código del estado" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre del estado" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Descripción opcional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activo</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "true")}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Sí</SelectItem>
                      <SelectItem value="false">No</SelectItem>
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
