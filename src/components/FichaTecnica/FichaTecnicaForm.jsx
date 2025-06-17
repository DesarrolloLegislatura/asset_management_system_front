import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/authStore";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { useStatus } from "@/hooks/useStatus";

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
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { ASSISTANCE_TYPES } from "@/constants/assistance";
import { LoadingPage } from "../Pages/LoadingPage";

export function FichaTecnicaForm() {
  const { idFichaIngreso } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatusId, setCurrentStatusId] = useState(null);
  const navigate = useNavigate();

  const { fichaTecnicaById, updateFichaTecnica, fetchByIdFichaTecnica } =
    useFichaTecnica(false);

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
    assistance: "",
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

      console.log("fichaTecnicaById", fichaData);

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
        // Campos de Resolución Técnica
        status: statusId?.toString() || "",
        assistance: fichaData.assistance || "",
        weighting: fichaData.asset?.weighting?.name || "",
        tech_description: fichaData.tech_description || "",
      };

      reset(formData);

      // Guardar el estado actual para determinar transiciones permitidas
      setCurrentStatusId(statusId);
    },
    [reset]
  );

  // Poblar formulario cuando se cargan los datos - ACTUALIZADO
  useEffect(() => {
    if (fichaTecnicaById && Object.keys(fichaTecnicaById).length > 0) {
      populateFormWithData(fichaTecnicaById);
    }
  }, [fichaTecnicaById, populateFormWithData]);

  const onSubmit = async (data) => {
    const dataToSend = {
      // Mantener datos originales de la ficha de ingreso
      user_pc: data.user_pc,
      pass_pc: data.pass_pc,
      // Datos de resolución técnica
      tech_description: data.tech_description,
      assistance: data.assistance,
      status: [parseInt(data.status)],
      users: [user.id],
      asset: fichaTecnicaById?.asset?.id || null,
    };

    try {
      await updateFichaTecnica(idFichaIngreso, dataToSend);
      navigate(`/ficha-tecnica/detail/${idFichaIngreso}`);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const toggleInfoSection = () => setIsInfoSectionOpen(!isInfoSectionOpen);

  if (isLoading) return <LoadingPage mensaje="Cargando datos de la ficha..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
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
          <Card className="form-container">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-blue-600">📋</span>
                  Información del Equipo
                  <Badge variant="secondary" className="ml-2">
                    Solo lectura
                  </Badge>
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleInfoSection}
                >
                  {isInfoSectionOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>

            {isInfoSectionOpen && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            disabled={true}
                            placeholder="Nombre completo"
                            className="text-lg font-bold bg-muted text-muted-foreground"
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
                          <Input
                            {...field}
                            disabled={true}
                            className="text-lg font-bold bg-muted text-muted-foreground"
                            placeholder="Número de teléfono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                      <FormLabel>
                        Estado del Bien
                        {currentStatus && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            (Actual: {currentStatus.name})
                          </span>
                        )}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
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

                {/* Asistido */}
                <FormField
                  control={control}
                  name="assistance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Asistencia</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione asistencia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ASSISTANCE_TYPES.PRESENCIAL}>
                            👨‍💼 Presencial
                          </SelectItem>
                          <SelectItem value={ASSISTANCE_TYPES.REMOTO}>
                            💻 Remoto
                          </SelectItem>
                          <SelectItem value={ASSISTANCE_TYPES.TELEFONO}>
                            📞 Telefónico
                          </SelectItem>
                          <SelectItem value={ASSISTANCE_TYPES.OTRO}>
                            🔧 Otro
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ponderación */}
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
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
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
          </div>
        </form>
      </Form>
    </div>
  );
}
