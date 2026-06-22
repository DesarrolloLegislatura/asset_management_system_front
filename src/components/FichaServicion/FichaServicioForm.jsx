import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AREAS_MOCK,
  BUILDINGS_MOCK,
  REALIZADO_POR_MOCK,
  SERVICIOS_MOCK,
  TIPOS_BIEN_MOCK,
} from "@/data/fichaServicioData";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Plus, Trash2, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FichaServivioPrint } from "./FichaServivioPrint";
import { useNavigate } from "react-router";

const TODAY = new Date().toISOString().split("T")[0];

const DEFAULT_VALUES = {
  area: "",
  building: "",
  date: TODAY,
  performed_by: "",
  patrimony_number: "",
  observation: "",
  record_type: "servicio",
  goods: [{ asset_type: "", quantity: 1 }],
  services: [],
};

const resolveFichaData = (values) => ({
  area: AREAS_MOCK.find((a) => String(a.id) === String(values.area))?.name || "",
  building:
    BUILDINGS_MOCK.find((b) => String(b.id) === String(values.building))?.name ||
    "",
  date: values.date,
  performed_by:
    REALIZADO_POR_MOCK.find((p) => p.id === values.performed_by)?.name || "",
  patrimony_number: values.patrimony_number,
  observation: values.observation,
  record_type: values.record_type,
  goods: (values.goods || []).map((g) => ({
    asset_type: TIPOS_BIEN_MOCK.find((t) => t.id === g.asset_type)?.name || "",
    quantity: g.quantity,
  })),
  services: (values.services || []).map(
    (id) => SERVICIOS_MOCK.find((s) => s.id === id)?.name || id,
  ),
});

export function FichaServicioForm() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  const form = useForm({ defaultValues: DEFAULT_VALUES });
  const { control, handleSubmit, watch, register } = form;

  const recordType = watch("record_type");
  const formValues = watch();
  const fichaDataForPrint = resolveFichaData(formValues);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "goods",
  });

  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoadingCatalogs(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setAreas(AREAS_MOCK);
      setBuildings(BUILDINGS_MOCK);
      setLoadingCatalogs(false);
    };

    fetchCatalogs();
  }, []);

  const onSubmit = (data) => {
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Nueva Ficha de Servicio
        </h1>
        <p className="text-sm text-muted-foreground">
          Complete los campos para registrar y generar la ficha de servicio
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-green-600" />
                Datos Generales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Área */}
                <FormField
                  control={control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Área <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <SearchableSelect
                          options={areas}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={loadingCatalogs}
                          loading={loadingCatalogs}
                          placeholder="Buscar área..."
                          emptyMessage="No se encontró ningún área con ese nombre."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Edificio */}
                <FormField
                  control={control}
                  name="building"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Edificio <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ? String(field.value) : ""}
                        disabled={loadingCatalogs}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                loadingCatalogs
                                  ? "Cargando edificios..."
                                  : "Seleccione un edificio"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {buildings.map((building) => (
                            <SelectItem
                              key={building.id}
                              value={String(building.id)}
                            >
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fecha */}
                <FormField
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Fecha <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="w-full cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Realizado por */}
                <FormField
                  control={control}
                  name="performed_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Realizado por <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el técnico" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {REALIZADO_POR_MOCK.map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              {person.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Número de Patrimonio */}
                <FormField
                  control={control}
                  name="patrimony_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Patrimonio</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ingrese el número de patrimonio"
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tipo de Registro */}
                <FormField
                  control={control}
                  name="record_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tipo de Registro <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-6 pt-2">
                          {[
                            { value: "servicio", label: "Servicio" },
                            { value: "entrega", label: "Entrega" },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                value={option.value}
                                checked={field.value === option.value}
                                onChange={() => field.onChange(option.value)}
                                className="accent-green-600 h-4 w-4"
                              />
                              <span className="text-sm font-medium">
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Observación */}
                <FormField
                  control={control}
                  name="observation"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Observación</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={4}
                          placeholder="Escriba las observaciones o comentarios pertinentes"
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sección condicional: Entrega de Bienes */}
          {recordType === "entrega" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Bienes a Entregar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-end p-3 rounded-md border border-border bg-muted/30"
                  >
                    {/* Tipo de Bien */}
                    <FormField
                      control={control}
                      name={`goods.${index}.asset_type`}
                      render={({ field: assetField }) => (
                        <FormItem>
                          <FormLabel className="text-xs">
                            Tipo de Bien
                          </FormLabel>
                          <Select
                            onValueChange={assetField.onChange}
                            value={assetField.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione el tipo de bien" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIPOS_BIEN_MOCK.map((tipo) => (
                                <SelectItem key={tipo.id} value={tipo.id}>
                                  {tipo.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Cantidad */}
                    <FormField
                      control={control}
                      name={`goods.${index}.quantity`}
                      render={({ field: qtyField }) => (
                        <FormItem className="w-28">
                          <FormLabel className="text-xs">Cantidad</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              {...qtyField}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Eliminar fila */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive mb-0.5"
                      title="Eliminar fila"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ asset_type: "", quantity: 1 })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar bien
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Sección condicional: Servicios */}
          {recordType === "servicio" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-purple-600" />
                  Servicios Realizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICIOS_MOCK.map((servicio) => (
                    <label
                      key={servicio.id}
                      className="flex items-center gap-3 p-3 rounded-md border border-border cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        value={servicio.id}
                        {...register("services")}
                        className="accent-green-600 h-4 w-4 shrink-0"
                      />
                      <span className="text-sm">{servicio.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Acciones */}
          <div className="flex justify-end gap-3">
            <FichaServivioPrint fichaData={fichaDataForPrint} />
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
