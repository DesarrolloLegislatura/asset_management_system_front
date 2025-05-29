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
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown, ChevronUp, Loader2, Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { useStatus } from "@/hooks/useStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FichaTecnicaForm() {
  const { idFichaIngreso } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    fichaTecnicaById,
    createFichaTecnica,
    updateFichaTecnica,
    fetchByIdFichaTecnica,
  } = useFichaTecnica(false);

  const { status: allStatus, loading: loadingStatus } = useStatus();
  const user = useAuthStore((state) => state.user);

  const form = useForm({
    defaultValues: {
      // Información del bien (datos de FichaIngreso)
      numero_patrimonio: "",
      tipo_de_bien: "",
      act_simple: "",
      fecha_de_ingreso: "",
      anio_act_simple: "",
      area: "",
      edificio: "",
      usuario_pc: "",
      contrasenia_pc: "",
      descripcion_user: "",
      contacto_nombre: "",
      contacto_telefono: "",
      medio_solicitud: "",
      // Campos de Resolución Técnica
      estado_del_bien: "",
      asistido: "",
      ponderacion: "",
      descripcion_tec: "",
    },
  });

  const { control, handleSubmit, setValue, reset, watch } = form;

  // Estados para secciones colapsables
  const [isInfoSectionOpen, setIsInfoSectionOpen] = useState(true);
  const [isTechSectionOpen, setIsTechSectionOpen] = useState(true);

  // Filtrar estados disponibles para técnicos
  const getAvailableStatusForTechnician = () => {
    if (!allStatus || allStatus.length === 0) return [];

    const technicianAllowedStatus = [
      "en reparación",
      "en espera de repuestos",
      "diagnóstico pendiente",
      "reparado",
      "se recomienda baja",
      "en reparación externa",
    ];

    return allStatus.filter((status) =>
      technicianAllowedStatus.some((allowed) =>
        status.name.toLowerCase().includes(allowed.toLowerCase())
      )
    );
  };

  // Obtener estados disponibles según el rol del usuario
  const getAvailableStatus = () => {
    if (user.group === "Admin") {
      return allStatus; // Admin puede ver todos los estados
    } else if (user.group === "Tecnico") {
      return getAvailableStatusForTechnician();
    }
    return allStatus;
  };

  useEffect(() => {
    const loadFichaTecnica = async () => {
      if (idFichaIngreso) {
        setIsEditMode(true);
        setIsLoading(true);
        try {
          await fetchByIdFichaTecnica(+idFichaIngreso);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadFichaTecnica();
  }, [idFichaIngreso, fetchByIdFichaTecnica]);

  // Poblar formulario cuando se cargan los datos
  useEffect(() => {
    if (
      isEditMode &&
      fichaTecnicaById &&
      Object.keys(fichaTecnicaById).length > 0
    ) {
      // Mapear datos de FichaIngreso a campos del formulario
      const formData = {
        // Información del bien (de FichaIngreso)
        numero_patrimonio: fichaTecnicaById.inventory || "",
        tipo_de_bien: fichaTecnicaById.asset?.typeasset?.name || "",
        act_simple: fichaTecnicaById.act_simple || "",
        fecha_de_ingreso: fichaTecnicaById.date_in || "",
        anio_act_simple: fichaTecnicaById.year_act_simple || "",
        area: fichaTecnicaById.asset?.area?.name || "",
        edificio: fichaTecnicaById.asset?.building?.name || "",
        usuario_pc: fichaTecnicaById.user_pc || "",
        contrasenia_pc: fichaTecnicaById.pass_pc || "",
        descripcion_user: fichaTecnicaById.user_description || "",
        contacto_nombre: fichaTecnicaById.contact_name || "",
        contacto_telefono: fichaTecnicaById.contact_phone || "",
        medio_solicitud: fichaTecnicaById.means_application || "",
        // Campos de Resolución Técnica
        estado_del_bien: fichaTecnicaById.status?.[0]?.id?.toString() || "",
        asistido: fichaTecnicaById.assistance || "",
        ponderacion: fichaTecnicaById.ponderacion || "",
        descripcion_tec: fichaTecnicaById.tech_description || "",
      };

      reset(formData);
    }
  }, [isEditMode, fichaTecnicaById, reset]);

  const onSubmit = async (data) => {
    const dataToSend = {
      // Mantener datos originales de la ficha de ingreso
      act_simple: data.act_simple,
      year_act_simple:
        data.anio_act_simple || new Date().getFullYear().toString(),
      user_description: data.descripcion_user,
      user_pc: data.usuario_pc,
      pass_pc: data.contrasenia_pc,
      contact_name: data.contacto_nombre,
      contact_phone: data.contacto_telefono,
      means_application: data.medio_solicitud,
      date_in: data.fecha_de_ingreso,
      // Datos de resolución técnica
      tech_description: data.descripcion_tec,
      assistance: data.asistido,
      ponderacion: data.ponderacion,
      status: [parseInt(data.estado_del_bien)],
      users: [user.id],
      // Mantener asset original si existe
      asset: fichaTecnicaById?.asset?.id || null,
    };

    try {
      let response;
      if (isEditMode) {
        response = await updateFichaTecnica(idFichaIngreso, dataToSend);
        navigate(`/ficha-tecnica/detail/${idFichaIngreso}`);
      } else {
        response = await createFichaTecnica(dataToSend);
        if (response?.id) {
          navigate(`/ficha-tecnica/detail/${response.id}`);
        }
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };
  console.log("fichaTecnicaById", fichaTecnicaById);

  const toggleInfoSection = () => setIsInfoSectionOpen(!isInfoSectionOpen);
  const toggleTechSection = () => setIsTechSectionOpen(!isTechSectionOpen);

  if (isLoading && isEditMode && !fichaTecnicaById) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Cargando datos de la ficha...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode
            ? `Resolución Técnica - Ficha #${idFichaIngreso}`
            : "Nueva Ficha Técnica"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isEditMode
            ? "Complete la información técnica para resolver la incidencia"
            : "Crear nueva ficha técnica"}
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
                  {isEditMode && (
                    <Badge variant="secondary" className="ml-2">
                      Solo lectura
                    </Badge>
                  )}
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
                            disabled={isEditMode}
                            className={isEditMode ? "bg-muted" : ""}
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
                            disabled={isEditMode}
                            className={isEditMode ? "bg-muted" : ""}
                            placeholder="Tipo de bien"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              disabled={isEditMode}
                              className={`pr-16 ${
                                isEditMode ? "bg-muted" : ""
                              }`}
                              placeholder="Actuación simple"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                              /
                              {watch("anio_act_simple") ||
                                new Date().getFullYear()}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            disabled={isEditMode}
                            className={isEditMode ? "bg-muted" : ""}
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
                            disabled={isEditMode}
                            className={isEditMode ? "bg-muted" : ""}
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
                            disabled={isEditMode}
                            className={isEditMode ? "bg-muted" : ""}
                            placeholder="Edificio"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            disabled={isEditMode}
                            className={isEditMode ? "bg-muted" : ""}
                            placeholder="Usuario del PC"
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
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              {...field}
                              disabled={isEditMode}
                              className={`pr-10 ${
                                isEditMode ? "bg-muted" : ""
                              }`}
                              placeholder="Contraseña del PC"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isEditMode}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
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
                          disabled={isEditMode}
                          className={`flex w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                            isEditMode ? "bg-muted" : ""
                          }`}
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
                            disabled={isEditMode}
                            className={isEditMode ? "bg-muted" : ""}
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
                          <Input
                            {...field}
                            disabled={isEditMode}
                            className={isEditMode ? "bg-muted" : ""}
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
                  <Badge variant="default" className="ml-2">
                    {user.group === "Tecnico" ? "Técnico" : "Administrador"}
                  </Badge>
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleTechSection}
                >
                  {isTechSectionOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>

            {isTechSectionOpen && (
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Estado del Bien */}
                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado del Bien</FormLabel>
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
                            {getAvailableStatus().map((estado) => (
                              <SelectItem
                                key={estado.id}
                                value={estado.id.toString()}
                              >
                                {estado.name}
                              </SelectItem>
                            ))}
                            {loadingStatus && (
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
                            <SelectItem value="presencial">
                              👨‍💼 Presencial
                            </SelectItem>
                            <SelectItem value="remoto">💻 Remoto</SelectItem>
                            <SelectItem value="telefono">
                              📞 Telefónico
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione ponderación" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                <span>1 - Muy Baja</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="2">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                                <span>2 - Baja</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="3">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                <span>3 - Media</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="4">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-lime-500 rounded-full"></span>
                                <span>4 - Alta</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="5">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <span>5 - Muy Alta</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel>
                        Descripción de la Resolución Técnica
                      </FormLabel>
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
            )}
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
                <>{isEditMode ? "Actualizar Resolución" : "Crear Ficha"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
