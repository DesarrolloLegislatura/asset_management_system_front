import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/shared/auth/authStore";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { useStatus } from "@/hooks/useStatus";

import { Button } from "@/shared/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { ChevronDown, ChevronUp, Loader2, Edit, Trash2 } from "lucide-react";
// import { ASSISTANCE_TYPES } from "@/constants/assistance";
import { LoadingPage } from "@/shared/pages/LoadingPage";

export function FichaTecnicaForm() {
  const { idFichaIngreso } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatusId, setCurrentStatusId] = useState(null);
  const [showStatusReminder, setShowStatusReminder] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isConfirmingSaveRef = useRef(false);
  const navigate = useNavigate();

  const {
    fichaTecnicaById,
    updateFichaTecnica,
    fetchByIdFichaTecnica,
    deleteFichaTecnica,
  } = useFichaTecnica(false);

  const { loadingStatus, getFichaTecnicaStatesWithFlow } = useStatus();
  const user = useAuthStore((state) => state.user);

  const defaultFormValues = {
    inventory: "",
    typeasset: "",
    act_simple: "",
    date_in: "",
    year_act_simple: "",
    area: "",
    building: "",
    user_pc: "",
    pass_pc: "",
    user_description: "",
    contact_name: "",
    contact_phone: "",
    means_application: "",
    status: "",
    // assistance: "",
    weighting: "",
    tech_description: "",
  };

  const form = useForm({
    defaultValues: defaultFormValues,
  });

  const { control, handleSubmit, reset, watch } = form;

  // Estados para secciones colapsables
  const [isInfoSectionOpen, setIsInfoSectionOpen] = useState(true);

  // Obtener estados filtrados para Ficha Técnica con flujo de trabajo
  const availableStatus = useMemo(() => {
    return getFichaTecnicaStatesWithFlow(currentStatusId);
  }, [getFichaTecnicaStatesWithFlow, currentStatusId]);

  // Obtener el estado actual para mostrarlo
  const currentStatus = useMemo(() => {
    if (!currentStatusId) return null;
    return availableStatus.find((status) => status.id === currentStatusId);
  }, [currentStatusId, availableStatus]);

  useEffect(() => {
    if (!idFichaIngreso) return;

    const loadFichaTecnica = async () => {
      setIsLoading(true);
      try {
        await fetchByIdFichaTecnica(+idFichaIngreso);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Solo cargar si aún no tenemos datos
    if (fichaTecnicaById == null) {
      loadFichaTecnica();
    }
  }, [idFichaIngreso, fetchByIdFichaTecnica, fichaTecnicaById]);

  // Función para poblar el formulario con los datos obtenidos
  const populateFormWithData = useCallback(
    (fichaData) => {
      if (!fichaData || Object.keys(fichaData).length === 0) return;



      const statusId = fichaData.status_users[0].status.id;

      // Mapear datos de FichaIngreso a campos del formulario
      const formData = {
        // Información del bien (de FichaIngreso)
        inventory: fichaData.asset?.inventory || "",
        typeasset: fichaData.asset?.typeasset?.name || "",
        act_simple: fichaData.act_simple || "",
        date_in: fichaData.date_in || "",
        year_act_simple: fichaData.year_act_simple || "",
        area: fichaData.asset?.area?.name || "",
        building: fichaData.asset?.building?.name || "",
        user_pc: fichaData.user_pc || "",
        pass_pc: fichaData.pass_pc || "",
        user_description: fichaData.user_description || "",
        contact_name: fichaData.contact_name || "",
        contact_phone: fichaData.contact_phone || "",
        means_application: fichaData.means_application || "",
        // Campos de Resolución Técnica - MEJORADO
        status: statusId?.toString() || "",
        // assistance: fichaData.assistance || "",
        weighting: fichaData.asset?.weighting?.name || "",
        tech_description: fichaData.tech_description || "",
      };

      // Usar setTimeout para asegurar que el reset se ejecute después del render
      setTimeout(() => {
        reset(formData);
        // Guardar el estado actual para determinar transiciones permitidas
        setCurrentStatusId(statusId);
      }, 0);
    },
    [reset],
  );

  // Poblar formulario cuando se cargan los datos - ACTUALIZADO
  useEffect(() => {
    if (fichaTecnicaById && Object.keys(fichaTecnicaById).length > 0) {
      populateFormWithData(fichaTecnicaById);
    }
  }, [fichaTecnicaById, populateFormWithData]);

  // Nuevo useEffect para manejar el reset cuando los estados están disponibles
  useEffect(() => {
    if (fichaTecnicaById && currentStatusId && availableStatus.length > 0) {
      const statusId = fichaTecnicaById.status_users[0].status.id;
      // const assistance = fichaTecnicaById.assistance;

      // Validar que el estado actual esté en los estados disponibles
      const isStatusAvailable = availableStatus.some(
        (status) => status.id === statusId,
      );

      if (isStatusAvailable) {
        // Actualizar solo los campos problemáticos si no están correctamente establecidos
        const currentFormStatus = watch("status");
        // const currentFormAssistance = watch("assistance");

        if (currentFormStatus !== statusId.toString()) {
          form.setValue("status", statusId.toString());
        }

        // if (currentFormAssistance !== assistance && assistance) {
        //   form.setValue("assistance", assistance);
        // }
      }
    }
  }, [currentStatusId, availableStatus, fichaTecnicaById, form, watch]);

  const performSubmit = async (data) => {
    setIsLoading(true);

    const dataToSend = {
      user_pc: data.user_pc,
      pass_pc: data.pass_pc,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      tech_description: data.tech_description,
      status: [parseInt(data.status, 10)],
      users: [user.id],
      asset: fichaTecnicaById?.asset?.id || null,
    };

    try {
      await updateFichaTecnica(idFichaIngreso, dataToSend);
      navigate(`/ficha-tecnica/detail/${idFichaIngreso}`);
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (
      currentStatusId != null &&
      parseInt(data.status, 10) === currentStatusId
    ) {
      setPendingSubmitData(data);
      setShowStatusReminder(true);
      return;
    }
    await performSubmit(data);
  };

  const handleConfirmSaveWithoutStatusChange = async () => {
    if (!pendingSubmitData) return;
    const data = pendingSubmitData;
    isConfirmingSaveRef.current = true;
    setShowStatusReminder(false);
    setPendingSubmitData(null);
    await performSubmit(data);
    isConfirmingSaveRef.current = false;
  };

  const handleStayOnEdit = () => {
    setShowStatusReminder(false);
    setPendingSubmitData(null);
  };

  const handleStatusReminderOpenChange = (open) => {
    if (!open && !isConfirmingSaveRef.current) {
      handleStayOnEdit();
    }
  };

  const toggleInfoSection = () => setIsInfoSectionOpen(!isInfoSectionOpen);

  const handleDeleteFichaTecnica = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteFichaTecnica(idFichaIngreso);
      if (success) {
        setShowDeleteConfirm(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Error al eliminar la ficha:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  // Si está guardando, mostrar overlay de loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
        <LoadingPage mensaje="Guardando datos..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Resolución Técnica - Ficha N° {idFichaIngreso}
        </h1>
        <p className="text-sm text-muted-foreground">
          Complete la información técnica para resolver la incidencia
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección: Información del Equipo (Solo lectura si es modo edición) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-blue-600">📋</span>
                  Información del Equipo
                  <Badge variant="secondary" className="ml-2">
                    Solo lectura
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleInfoSection}
                    className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    {isInfoSectionOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {isInfoSectionOpen && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Número de Inventario */}
                  <FormField
                    control={control}
                    name="inventory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Inventario</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={true}
                            className="text-lg font-bold bg-muted text-muted-foreground"
                            placeholder="Número de inventario"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tipo de Bien */}
                  <FormField
                    control={control}
                    name="typeasset"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Bien</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={true}
                            className="text-lg font-bold bg-muted text-muted-foreground"
                            placeholder="Tipo de bien"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="weighting"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ponderación</FormLabel>
                        <Input
                          {...field}
                          disabled={true}
                          className="bg-muted"
                          placeholder="Ponderación"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Área */}
                  <FormField
                    control={control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={true}
                            className="text-lg font-bold bg-muted text-muted-foreground"
                            placeholder="Área"
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
                        <FormLabel>Edificio</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={true}
                            className="text-lg font-bold bg-muted text-muted-foreground"
                            placeholder="Edificio"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fecha de Ingreso */}
                  <FormField
                    control={control}
                    name="date_in"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Ingreso al Sistema </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={true}
                            className="text-lg font-bold bg-muted text-muted-foreground"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Acto Simple */}
                  <FormField
                    control={control}
                    name="act_simple"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actuación Simple</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              disabled={true}
                              className="text-lg font-bold bg-muted text-muted-foreground pr-16"
                              placeholder="Actuación simple"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                              /
                              {watch("year_act_simple") ||
                                new Date().getFullYear()}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Descripción del Usuario */}
                <FormField
                  control={control}
                  name="user_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción del Problema (Usuario)</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          disabled={true}
                          className="flex w-full min-h-[100px] rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-muted text-muted-foreground font-bold border-muted"
                          placeholder="Descripción del problema reportado por el usuario..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            )}
          </Card>

          {/* Sección: Resolución Técnica */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-green-600">🔧</span>
                  Resolución Técnica
                </CardTitle>
                <div className="flex items-center gap-2">
                  {fichaTecnicaById?.asset?.id && (
                    <div className="flex justify-end items-end col-span-3">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const editUrl = `${
                            import.meta.env.VITE_URL_SAB_EDIT_ASSET
                          }${fichaTecnicaById.asset.id}/change/`;
                          window.open(editUrl, "_blank");
                        }}
                        className="flex items-center gap-2 relative overflow-hidden
                               bg-gradient-to-r from-emerald-500 to-teal-600 
                               dark:from-emerald-400 dark:to-teal-500
                               text-white shadow-lg 
                               hover:from-emerald-600 hover:to-teal-700
                               dark:hover:from-emerald-500 dark:hover:to-teal-600
                               cursor-pointer h-10"
                      >
                        <Edit className="h-4 w-4 drop-shadow-sm" />
                        Modificar Información del Bien dentro de SAB
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Estado del Bien - ACTUALIZADO */}
                <FormField
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado del Bien</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
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
                                estado.id === currentStatusId ? "font-bold" : ""
                              }
                            >
                              {estado.name}
                              {estado.id === currentStatusId && (
                                <span className="ml-2 text-green-600">
                                  (Actual)
                                </span>
                              )}
                            </SelectItem>
                          ))}
                          {loadingStatus && availableStatus.length === 0 && (
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

               

                {/* Botón Modificar Información del Bien */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Usuario PC */}
                <FormField
                  control={control}
                  name="user_pc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario PC</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Usuario del PC" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contraseña PC */}
                <FormField
                  control={control}
                  name="pass_pc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña PC</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="Contraseña del PC"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Descripción Técnica */}
              <FormField
                control={control}
                name="tech_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción de la Resolución Técnica</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="flex w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Describa detalladamente las acciones realizadas, componentes reemplazados, configuraciones aplicadas, etc..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contacto Nombre */}
                <FormField
                  control={control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de Contacto</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          // disabled={true}
                          placeholder="Nombre completo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Teléfono Contacto */}
                <FormField
                  control={control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de Contacto</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número de teléfono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción - ACTUALIZADO */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isLoading} // Deshabilitar durante carga
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>Actualizar Resolución</>
              )}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading || isDeleting}
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Ficha
            </Button>
          </div>
        </form>
      </Form>

      {/* Dialog confirmación de eliminación */}
      <Dialog
        open={showDeleteConfirm}
        onOpenChange={(open) => {
          if (!isDeleting) setShowDeleteConfirm(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Eliminar ficha #{idFichaIngreso}
            </DialogTitle>
            <DialogDescription>
              Esta acción es <strong>permanente e irreversible</strong>.
              <br />
              <br />
              Se eliminará la ficha de ingreso N°{" "}
              <strong>{idFichaIngreso}</strong>
              {fichaTecnicaById?.asset?.inventory && (
                <>
                  {" "}
                  correspondiente al patrimonio{" "}
                  <strong>{fichaTecnicaById.asset.inventory}</strong>
                </>
              )}
              , junto con toda su resolución técnica asociada.
              <br />
              <br />
              ¿Está seguro que desea continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteFichaTecnica}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sí, eliminar ficha
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showStatusReminder}
        onOpenChange={handleStatusReminderOpenChange}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Actualizó el estado del bien?</DialogTitle>
            <DialogDescription>
              No olvide actualizar el campo <strong>Estado del Bien</strong>{" "}
              <br />
              {currentStatus?.name && (
                <>
                  {" "}
                  Estado actual es{" "}
                  <strong className="text-green-600 font-bold">
                    {currentStatus.name}
                  </strong>
                </>
              )}{" "}
              <br />
              Si ya lo hizo o desea guardar igual, confirme abajo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleStayOnEdit}>
              No actualicé, volver a editar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSaveWithoutStatusChange}
            >
              Ya actualicé los datos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
