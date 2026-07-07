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
  useCreatePriority,
  useUpdatePriority,
} from "../../hooks/useCatalogs";
import {
  prioritySchema,
  type PriorityFormValues,
} from "../../schemas/catalogSchemas";
import type { Priority } from "../../types";

interface PriorityFormDialogProps {
  mode: "create" | "edit";
  priority?: Priority;
  trigger: ReactNode;
}

const emptyDefaults: PriorityFormValues = {
  name: "",
  code: "",
  active: true,
};

export const PriorityFormDialog = ({
  mode,
  priority,
  trigger,
}: PriorityFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const createPriority = useCreatePriority();
  const updatePriority = useUpdatePriority();
  const isSubmitting = createPriority.isPending || updatePriority.isPending;

  const form = useForm<PriorityFormValues>({
    resolver: zodResolver(prioritySchema),
    defaultValues: emptyDefaults,
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && priority) {
      reset({
        name: priority.name,
        code: priority.code,
        active: priority.active ?? true,
      });
    } else {
      reset(emptyDefaults);
    }
  }, [open, mode, priority, reset]);

  const onSubmit = async (data: PriorityFormValues) => {
    const payload = { name: data.name, code: data.code, active: data.active };
    if (mode === "edit" && priority) {
      await updatePriority.mutateAsync({ id: priority.id as number, body: payload });
    } else {
      await createPriority.mutateAsync(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar prioridad" : "Nueva prioridad"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre de la prioridad" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Código <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Código de la prioridad" />
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
