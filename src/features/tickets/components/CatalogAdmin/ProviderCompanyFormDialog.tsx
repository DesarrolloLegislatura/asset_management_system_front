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
  useCreateProviderCompany,
  useUpdateProviderCompany,
} from "../../hooks/useCatalogs";
import {
  providerCompanySchema,
  type ProviderCompanyFormValues,
} from "../../schemas/catalogSchemas";
import type { ProviderCompany } from "../../types";

interface ProviderCompanyFormDialogProps {
  mode: "create" | "edit";
  company?: ProviderCompany;
  trigger: ReactNode;
}

const emptyDefaults: ProviderCompanyFormValues = {
  name: "",
  support_portal_url: "",
  contact_name: "",
  contact_email: "",
  active: true,
};

export const ProviderCompanyFormDialog = ({
  mode,
  company,
  trigger,
}: ProviderCompanyFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const createCompany = useCreateProviderCompany();
  const updateCompany = useUpdateProviderCompany();
  const isSubmitting = createCompany.isPending || updateCompany.isPending;

  const form = useForm<ProviderCompanyFormValues>({
    resolver: zodResolver(providerCompanySchema),
    defaultValues: emptyDefaults,
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && company) {
      reset({
        name: company.name,
        support_portal_url: company.support_portal_url ?? "",
        contact_name: company.contact_name ?? "",
        contact_email: company.contact_email ?? "",
        active: company.active ?? true,
      });
    } else {
      reset(emptyDefaults);
    }
  }, [open, mode, company, reset]);

  const onSubmit = async (data: ProviderCompanyFormValues) => {
    const payload = {
      name: data.name,
      support_portal_url: data.support_portal_url || null,
      contact_name: data.contact_name || null,
      contact_email: data.contact_email || null,
      active: data.active,
    };
    if (mode === "edit" && company) {
      await updateCompany.mutateAsync({ id: company.id as number, body: payload });
    } else {
      await createCompany.mutateAsync(payload);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar empresa" : "Nueva empresa"}
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
                    <Input {...field} placeholder="Nombre de la empresa" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="support_portal_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portal de soporte</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de contacto</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Persona de contacto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de contacto</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="contacto@empresa.com" />
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
