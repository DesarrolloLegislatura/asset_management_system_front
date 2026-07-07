import { Plus, Pencil } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { usePriorities, useServiceTypes, useTaskCategories } from "../hooks/useCatalogs";
import { CatalogTable, type CatalogColumn } from "../components/CatalogAdmin/CatalogTable";
import { PriorityFormDialog } from "../components/CatalogAdmin/PriorityFormDialog";
import { SimpleCatalogFormDialog } from "../components/CatalogAdmin/SimpleCatalogFormDialog";
import { CatalogDeleteDialog } from "../components/CatalogAdmin/CatalogDeleteDialog";
import type { Priority, ServiceType, TaskCategory } from "../types";

export const TicketCatalogAdminPage = () => {
  const { data: priorities = [], isLoading: loadingPriorities } = usePriorities();
  const { data: serviceTypes = [], isLoading: loadingServiceTypes } = useServiceTypes();
  const { data: taskCategories = [], isLoading: loadingTaskCategories } = useTaskCategories();

  const priorityColumns: CatalogColumn<Priority>[] = [
    { key: "name", header: "Nombre", render: (row) => row.name },
    { key: "code", header: "Código", render: (row) => row.code },
    {
      key: "active",
      header: "Activo",
      render: (row) => (
        <Badge variant={row.active ? "default" : "outline"}>
          {row.active ? "Sí" : "No"}
        </Badge>
      ),
    },
  ];

  const nameColumns = <T extends { name: string }>(): CatalogColumn<T>[] => [
    { key: "name", header: "Nombre", render: (row) => row.name },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Catálogos de Tickets</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Administración de prioridades, tipos de servicio y categorías
        </p>
      </div>

      <Tabs defaultValue="priorities">
        <TabsList>
          <TabsTrigger value="priorities">Prioridades</TabsTrigger>
          <TabsTrigger value="serviceTypes">Tipos de servicio</TabsTrigger>
          <TabsTrigger value="taskCategories">Categorías</TabsTrigger>
        </TabsList>

        <TabsContent value="priorities" className="py-4 space-y-4">
          <div className="flex justify-end">
            <PriorityFormDialog
              mode="create"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Nueva prioridad
                </Button>
              }
            />
          </div>
          <CatalogTable<Priority>
            columns={priorityColumns}
            rows={priorities}
            isLoading={loadingPriorities}
            emptyMessage="No hay prioridades registradas."
            renderActions={(row) => (
              <>
                <PriorityFormDialog
                  mode="edit"
                  priority={row}
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <CatalogDeleteDialog
                  resource="priority"
                  id={row.id as number}
                  label={row.name}
                />
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="serviceTypes" className="py-4 space-y-4">
          <div className="flex justify-end">
            <SimpleCatalogFormDialog
              resource="serviceType"
              mode="create"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Nuevo tipo de servicio
                </Button>
              }
            />
          </div>
          <CatalogTable<ServiceType>
            columns={nameColumns<ServiceType>()}
            rows={serviceTypes}
            isLoading={loadingServiceTypes}
            emptyMessage="No hay tipos de servicio registrados."
            renderActions={(row) => (
              <>
                <SimpleCatalogFormDialog
                  resource="serviceType"
                  mode="edit"
                  item={row}
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <CatalogDeleteDialog
                  resource="serviceType"
                  id={row.id as number}
                  label={row.name}
                />
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="taskCategories" className="py-4 space-y-4">
          <div className="flex justify-end">
            <SimpleCatalogFormDialog
              resource="taskCategory"
              mode="create"
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Nueva categoría
                </Button>
              }
            />
          </div>
          <CatalogTable<TaskCategory>
            columns={nameColumns<TaskCategory>()}
            rows={taskCategories}
            isLoading={loadingTaskCategories}
            emptyMessage="No hay categorías registradas."
            renderActions={(row) => (
              <>
                <SimpleCatalogFormDialog
                  resource="taskCategory"
                  mode="edit"
                  item={row}
                  trigger={
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <CatalogDeleteDialog
                  resource="taskCategory"
                  id={row.id as number}
                  label={row.name}
                />
              </>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
