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
  useCreateServiceType,
  useUpdateServiceType,
  useCreateTaskCategory,
  useUpdateTaskCategory,
} from "../../hooks/useCatalogs";
import {
  simpleCatalogSchema,
  type SimpleCatalogFormValues,
} from "../../schemas/catalogSchemas";
import type { ServiceType, TaskCategory } from "../../types";

type SimpleCatalogResource = "serviceType" | "taskCategory";

interface SimpleCatalogFormDialogProps {
  resource: SimpleCatalogResource;
  mode: "create" | "edit";
  item?: ServiceType | TaskCategory;
  trigger: ReactNode;
}

const RESOURCE_LABELS: Record<SimpleCatalogResource, string> = {
  serviceType: "tipo de servicio",
  taskCategory: "categoría",
};

const emptyDefaults: SimpleCatalogFormValues = { name: "" };

export const SimpleCatalogFormDialog = ({
  resource,
  mode,
  item,
  trigger,
}: SimpleCatalogFormDialogProps) => {
  const [open, setOpen] = useState(false);

  // Las reglas de hooks exigen llamarlos incondicionalmente; solo se usa el
  // par correspondiente a `resource` (fijo durante la vida del componente).
  const createServiceType = useCreateServiceType();
  const updateServiceType = useUpdateServiceType();
  const createTaskCategory = useCreateTaskCategory();
  const updateTaskCategory = useUpdateTaskCategory();

  const isSubmitting =
    resource === "serviceType"
      ? createServiceType.isPending || updateServiceType.isPending
      : createTaskCategory.isPending || updateTaskCategory.isPending;

  const form = useForm<SimpleCatalogFormValues>({
    resolver: zodResolver(simpleCatalogSchema),
    defaultValues: emptyDefaults,
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!open) return;
    reset(mode === "edit" && item ? { name: item.name } : emptyDefaults);
  }, [open, mode, item, reset]);

  const onSubmit = async (data: SimpleCatalogFormValues) => {
    const payload = { name: data.name };
    if (resource === "serviceType") {
      if (mode === "edit" && item) {
        await updateServiceType.mutateAsync({ id: item.id as number, body: payload });
      } else {
        await createServiceType.mutateAsync(payload);
      }
    } else {
      if (mode === "edit" && item) {
        await updateTaskCategory.mutateAsync({ id: item.id as number, body: payload });
      } else {
        await createTaskCategory.mutateAsync(payload);
      }
    }
    setOpen(false);
  };

  const label = RESOURCE_LABELS[resource];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? `Editar ${label}` : `Nueva/o ${label}`}
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
                    <Input {...field} placeholder={`Nombre de la/el ${label}`} />
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
