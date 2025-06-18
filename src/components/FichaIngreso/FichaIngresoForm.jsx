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
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { Plus } from "lucide-react";
import { InventorySerch } from "../Iventario/InventorySerch";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { LoadingPage } from "../Pages/LoadingPage";

export function FichaIngresoForm() {
  const { idFichaIngreso } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const dateInputRef = useRef(null);
  const dateOutInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [assetSelected, setAssetSelected] = useState(false);
  const [currentStatusId, setCurrentStatusId] = useState(null);
  const { loadingStatus, getFichaIngresoStatesWithFlow } = useStatus();
  const [areaName, setAreaName] = useState("");
  const [buildingName, setBuildingName] = useState("");

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
      date_out: "",
      retired_by: "",
    },
  });
  const { control, handleSubmit, setValue, reset } = form;

  // Función para poblar el formulario con los datos obtenidos
  const populateFormWithData = useCallback(
    (fichaData) => {
      if (!fichaData) return;

      const statusId = fichaData.status_users[0].status.id;

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
        status: statusId?.toString() || "1",
        date_out: fichaData.date_out ? fichaData.date_out.split("T")[0] : "",
        retired_by: fichaData.retired_by || "",
      };

      // Resetear el formulario con los nuevos datos
      reset(formData);

      // Guardar el estado actual para determinar transiciones permitidas
      setCurrentStatusId(statusId);

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
    setIsLoading(true);
    console.log("data", data);
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
      date_out: data.date_out || null,
      retired_by: data.retired_by || "",
      area: data.area,
      building: data.building,
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
    } finally {
      setIsLoading(false);
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

  // Obtener estados filtrados para Ficha de Ingreso con flujo de trabajo
  const availableStatus = useMemo(() => {
    return getFichaIngresoStatesWithFlow(!isEditMode, currentStatusId);
  }, [getFichaIngresoStatesWithFlow, isEditMode, currentStatusId]);

  // Obtener el estado actual para mostrarlo
  const currentStatus = useMemo(() => {
    if (!currentStatusId || !isEditMode) return null;
    return availableStatus.find((status) => status.id === currentStatusId);
  }, [currentStatusId, isEditMode, availableStatus]);

  // Genérico para manejar cambios de campo
  const handleValueChange = (field) => (name, value) => {
    setValue(field, value, { shouldValidate: true });
    if (field === "area") {
      setAreaName(name);
    }
    if (field === "building") {
      setBuildingName(name);
    }
  };

  // Louder de creacion de la ficha, miesntras se crea la ficha, se muestra un loader
  if (isLoading) return <LoadingPage mensaje="Cargando datos de la ficha..." />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode
            ? `Editar Ficha Ingreso #${idFichaIngreso}`
            : "Nueva Ficha Ingreso"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isEditMode
            ? "Edite los campos que desee actualizar "
            : "Complete los campos requeridos para crear la ficha de ingreso"}
        </p>
      </div>

      {isLoading && isEditMode ? (
        <LoadingPage mensaje="Cargando datos de la ficha..." />
      ) : (
        <div className="max-w-4xl mx-auto">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Card className="form-container">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-green-600">🔧</span>
                      Resolución Técnica
                    </CardTitle>
                  </div>
                </CardHeader>

                {/* Contenido colapsable */}
                <div className="transition-all duration-300 max-h-full p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Numero de Patrimono */}

                    <FormField
                      control={control}
                      name="inventory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Numero de Inventario{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-9 gap-2">
                              <div className="col-span-8">
                                <InventorySerch
                                  value={field.value}
                                  onChange={
                                    isEditMode
                                      ? handleInventoryChangeInEditMode
                                      : handleInventoryChange
                                  }
                                  onTypeassetChange={handleValueChange(
                                    "typeasset"
                                  )}
                                  onAreaChange={handleValueChange("area")}
                                  onBuildingChange={handleValueChange(
                                    "building"
                                  )}
                                  onEditMode={isEditMode}
                                  error={fichaTecnicaById?.asset?.error}
                                />
                              </div>
                              <div className="col-span-1">
                                <Link
                                  to="http://192.168.200.40:9000/sab/asset/assets/add/"
                                  target="_blank"
                                  className="flex items-center justify-center h-full bg-muted/50 rounded-md p-1"
                                >
                                  <Plus className="h-4 w-4 text-green-500" />
                                </Link>
                              </div>
                            </div>
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
                            value={areaName}
                            className="w-full"
                            placeholder="Area que pertenece el bien"
                            disabled={true}
                          />
                          <input {...field} />
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
                            value={buildingName}
                            className="w-full"
                            placeholder="Edificio que pertenece el bien"
                            disabled={true}
                          />
                          <input {...field} />
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
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Fecha Ingreso</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                ref={dateInputRef}
                                onClick={() =>
                                  dateInputRef.current?.showPicker()
                                }
                                className="w-full cursor-pointer"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    {/* Estado */}
                    <FormField
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Estado del Bien
                            {currentStatus && isEditMode && (
                              <span className="ml-2 text-sm text-muted-foreground">
                                (Actual: {currentStatus.name})
                              </span>
                            )}
                          </FormLabel>
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
                                  className={
                                    estado.id === currentStatusId
                                      ? "bg-blue-50 font-medium"
                                      : ""
                                  }
                                >
                                  {estado.name}
                                  {estado.id === currentStatusId && (
                                    <span className="ml-2 text-blue-600">
                                      (Actual)
                                    </span>
                                  )}
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

                    {/* Campos condicionales para cuando el estado es "Retirado" */}
                    {(() => {
                      const currentState = availableStatus.find(
                        (status) => status.id === parseInt(form.watch("status"))
                      );
                      const isRetirado = currentState?.name
                        ?.toLowerCase()
                        .includes("retirado");

                      return (
                        isRetirado && (
                          <>
                            {/* Fecha de salida */}
                            <FormField
                              control={control}
                              name="date_out"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fecha Retiro</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="date"
                                      {...field}
                                      ref={dateOutInputRef}
                                      onClick={() =>
                                        dateOutInputRef.current?.showPicker()
                                      }
                                      className="w-full cursor-pointer"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Retirado por */}
                            <FormField
                              control={control}
                              name="retired_by"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Retirado por</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="w-full"
                                      placeholder="Ingrese el nombre del agente que retiró el bien"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )
                      );
                    })()}

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
                              placeholder="Escriba la descripción del problema del bien"
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
              </Card>
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
