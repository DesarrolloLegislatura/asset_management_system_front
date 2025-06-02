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
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { useStatus } from "@/hooks/useStatus";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";
import { InventorySerch } from "../Iventario/InventorySerch";

export function FichaIngresoForm() {
  const { idFichaIngreso } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [assetSelected, setAssetSelected] = useState(false);
  const { loading: loadingStatus, getFichaIngresoStates } = useStatus();

  const {
    fichaTecnicaById,
    createFichaTecnica,
    fetchByIdFichaTecnica,
    updateFichaTecnica,
  } = useFichaTecnica(false);

  const form = useForm({
    defaultValues: {
      asset: null,
      inventory: "",
      typeasset: "",
      area: "",
      building: "",
      act_simple: "",
      date_in: new Date().toISOString().split("T")[0],
      usuario_pc: "",
      contrasenia_pc: "",
      year_act_simple: new Date().getFullYear().toString(),
      user_description: "",
      contact_name: "",
      contact_phone: "",
      means_application: "",
      status: "1",
    },
  });
  const { control, handleSubmit, setValue, reset } = form;

  // Función para poblar el formulario con los datos obtenidos
  const populateFormWithData = useCallback(
    (fichaData) => {
      if (!fichaData) return;

      // Mapear los datos de la API al formulario
      const formData = {
        asset: fichaData.asset?.id || null,
        inventory: fichaData.asset?.inventory || "",
        typeasset: fichaData.asset?.typeasset?.name || "",
        area: fichaData.asset?.area?.name || "",
        building: fichaData.asset?.building?.name || "",
        act_simple: fichaData.act_simple || "",
        date_in: fichaData.date_in
          ? fichaData.date_in.split("T")[0]
          : new Date().toISOString().split("T")[0],
        usuario_pc: fichaData.user_pc || "",
        contrasenia_pc: fichaData.pass_pc || "",
        year_act_simple:
          fichaData.year_act_simple || new Date().getFullYear().toString(),
        user_description: fichaData.user_description || "",
        contact_name: fichaData.contact_name || "",
        contact_phone: fichaData.contact_phone || "",
        means_application: fichaData.means_application || "",
        status: fichaData.status?.[0]?.id?.toString() || "1",
      };

      // Resetear el formulario con los nuevos datos
      reset(formData);

      // Marcar que hay un asset seleccionado si existe
      setAssetSelected(!!fichaData.asset?.id);
    },
    [reset, setAssetSelected]
  );

  useEffect(() => {
    const editMode = async () => {
      if (idFichaIngreso) {
        setIsEditMode(true);
        setIsLoading(true);
        try {
          const fichaEdit = await fetchByIdFichaTecnica(idFichaIngreso);
          console.log("fichaEdit", fichaEdit);

          if (fichaEdit) {
            populateFormWithData(fichaEdit);
          }
        } catch (error) {
          console.error("Error al cargar la ficha:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    editMode();
  }, [idFichaIngreso, fetchByIdFichaTecnica, populateFormWithData]);

  // También poblar cuando fichaTecnicaById cambie (por si el hook actualiza el estado)
  useEffect(() => {
    if (isEditMode && fichaTecnicaById && !isLoading) {
      populateFormWithData(fichaTecnicaById);
    }
  }, [fichaTecnicaById, isEditMode, isLoading, populateFormWithData]);

  const onSubmit = async (data) => {
    // Construir solo los campos requeridos por la API
    const dataToSend = {
      act_simple: data.act_simple,
      year_act_simple: new Date().getFullYear().toString(),
      user_description: data.user_description,
      date: null, // Si tienes un campo de fecha diferente, cámbialo aquí
      user_pc: data.usuario_pc,
      pass_pc: data.contrasenia_pc,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      means_application: data.means_application,
      date_in: data.date_in,
      asset: data.asset,
      status: [parseInt(data.status)], // Convertir a entero para asegurar que se envía como número
      users: [user.id],
    };

    try {
      let response;
      if (isEditMode) {
        response = await updateFichaTecnica(idFichaIngreso, dataToSend);
        navigate(`/ficha-ingreso/detail/${idFichaIngreso}`);
      } else {
        response = await createFichaTecnica(dataToSend);
        console.log("Response from API:", response); // Log API response
        if (response.asset) {
          navigate(`/ficha-ingreso/detail/${response.id}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInventoryChange = (inventoryValue, assetId) => {
    setValue("inventory", inventoryValue, { shouldValidate: true });
    setValue("asset", assetId, { shouldValidate: true });
    setAssetSelected(!!assetId);
  };

  // Función especial para el modo edición que no sobrescriba los datos cargados
  const handleInventoryChangeInEditMode = (inventoryValue, assetId) => {
    // En modo edición, solo actualizar si realmente se selecciona un nuevo asset
    if (assetId) {
      setValue("inventory", inventoryValue, { shouldValidate: true });
      setValue("asset", assetId, { shouldValidate: true });
      setAssetSelected(true);
    } else {
      setValue("inventory", inventoryValue, { shouldValidate: true });
      // No limpiar el asset en modo edición a menos que sea intencional
      setAssetSelected(!!form.getValues("asset"));
    }
  };

  // Obtener estados filtrados para Ficha de Ingreso
  const availableStatus = useMemo(() => {
    return getFichaIngresoStates(!isEditMode); // !isEditMode = isCreating
  }, [getFichaIngresoStates, isEditMode]);

  // Genérico para manejar cambios de campo
  const handleValueChange = (field) => (value) =>
    setValue(field, value, { shouldValidate: true });

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {isEditMode
          ? `Editar Ficha Ingreso #${idFichaIngreso}`
          : "Nueva Ficha Ingreso"}
      </h2>

      {isLoading && isEditMode ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Cargando datos de la ficha...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-6 overflow-hidden border border-dashed border-gray-300 rounded-lg bg-white shadow-lg">
                <div className="p-4 bg-blue-50 border-b border-dashed border-gray-300 flex justify-between items-center cursor-pointer">
                  <h3 className="font-medium text-blue-800">
                    Datos del Equipo
                  </h3>
                </div>

                {/* Contenido colapsable */}
                <div className="transition-all duration-300 max-h-full p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Numero de Patrimono */}

                    <FormField
                      control={control}
                      name="inventory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numero de Inventario</FormLabel>
                          <FormControl>
                            <InventorySerch
                              value={field.value}
                              onChange={
                                isEditMode
                                  ? handleInventoryChangeInEditMode
                                  : handleInventoryChange
                              }
                              onTypeassetChange={handleValueChange("typeasset")}
                              onAreaChange={handleValueChange("area")}
                              onBuildingChange={handleValueChange("building")}
                              onEditMode={isEditMode}
                              error={fichaTecnicaById?.asset?.error}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Tipo de Asset */}
                    <FormField
                      control={control}
                      name="typeasset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Bien </FormLabel>
                          <FormControl>
                            <Input
                              type={"text"}
                              {...field}
                              className="w-full"
                              placeholder="Tipo de Bien del patrimonio"
                              disabled={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Area */}
                    <FormField
                      control={control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area</FormLabel>
                          <Input
                            type={"text"}
                            {...field}
                            className="w-full"
                            placeholder="Area que pertenece el bien"
                            disabled={true}
                          />
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
                          <FormLabel>Edificio </FormLabel>
                          <Input
                            type={"text"}
                            {...field}
                            className="w-full"
                            placeholder="Edificio que pertenece el bien"
                            disabled={true}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Medio Solicitud  */}
                    <FormField
                      control={control}
                      name="means_application"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medio de Solicitud</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione el medio de solicitud" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="email">📧 Email</SelectItem>
                              <SelectItem value="mostrador">
                                🏢 Mostrador
                              </SelectItem>
                              <SelectItem value="nota">🗒️ Nota</SelectItem>
                              <SelectItem value="telefono">
                                📱 Telefono
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Act Simple */}
                    <FormField
                      control={control}
                      name="act_simple"
                      render={({ field }) => {
                        // Obtenemos los últimos dos dígitos del año actual.
                        const yearSuffix = new Date().getFullYear().toString();
                        return (
                          <FormItem>
                            <FormLabel>Acto Simple</FormLabel>
                            <FormControl>
                              {/* Contenedor único que agrupa el Input y el span */}
                              <div className="relative">
                                <Input
                                  type={"number"}
                                  {...field}
                                  className="w-full pr-12"
                                  placeholder="Ingrese el acto simple"
                                />
                                <span className="absolute font-bold right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                  /{yearSuffix}
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    {/* Fecha Ingreso */}
                    <FormField
                      control={control}
                      name="date_in"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Ingreso</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Estado */}
                    <FormField
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado del Bien</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                            disabled={loadingStatus}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableStatus.map((estado) => (
                                <SelectItem
                                  key={estado.id}
                                  value={estado.id.toString()}
                                >
                                  {estado.name}
                                </SelectItem>
                              ))}
                              {loadingStatus &&
                                availableStatus.length === 0 && (
                                  <SelectItem value="loading" disabled>
                                    Cargando estados...
                                  </SelectItem>
                                )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Descripción Usuario */}
                    <FormField
                      control={control}
                      name="user_description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Descripción del Usuario</FormLabel>
                          <FormControl>
                            <textarea
                              {...field}
                              className="flex w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              placeholder="Descripción detallada..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Usuario PC */}
                    <FormField
                      control={control}
                      name="usuario_pc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuario PC</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full"
                              placeholder="Usuario del equipo"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contraseña PC */}
                    <FormField
                      control={control}
                      name="contrasenia_pc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña PC</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="w-full"
                              placeholder="Contraseña del equipo"
                            />
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
                          <FormLabel>Nombre Contacto</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full"
                              placeholder="Ingrese el nombre de contacto"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contraseña PC */}
                    <FormField
                      control={control}
                      name="contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefono Contacto</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="w-full"
                              placeholder="Ingrese el telefono de contacto"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  type="button"
                >
                  Cancelar
                </Button>
                <div className="flex flex-col">
                  <Button type="submit" disabled={isLoading || !assetSelected}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isEditMode ? "Actualizar" : "Guardar"}
                  </Button>
                  {!assetSelected && (
                    <p className="text-yellow-500 text-xs mt-1">
                      Debes seleccionar un número de inventario
                    </p>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
