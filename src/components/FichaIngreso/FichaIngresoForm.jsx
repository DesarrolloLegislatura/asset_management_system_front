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
import { useDependencias } from "@/hooks/useDependencia";
import { useFichaTecnica } from "@/hooks/useFichaTecnica";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";
import { TIPOS_BIENES } from "@/constants/typeBienes";
import { useAuthorization } from "@/hooks/useAuthorization"; // Import the new authorization hook

export function FichaIngresoForm() {
  const { idFichaIngreso } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const {
    fichaTecnicaById,
    createFichaTecnica,
    updateFichaTecnica,
    fetchByIdFichaTecnica,
  } = useFichaTecnica();
  const form = useForm({
    defaultValues: {
      numero_patrimonio: "",
      act_simple: "",
      fecha_de_ingreso: new Date().toISOString().split("T")[0],
      usuario_pc: "",
      contrasenia_pc: "",
      anio_act_simple: new Date().getFullYear().toString(),
      descripcion_user: "",
      contacto_nombre: "",
      contacto_telefono: "",
      medio_solicitud: "",
      tipo_de_bien: "",
      estado_del_bien: "ingreso",
    },
  });
  const { control, handleSubmit, setValue, reset } = form;

  const user = useAuthStore((state) => state.user);
  const { allowedStates } = useAuthorization();
  const selectedDepGral = useWatch({
    control,
    name: "dependencia",
    exact: true,
  });

  const { dependencias, dependenciasInternas } =
    useDependencias(selectedDepGral);
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

  useEffect(() => {
    if (
      isEditMode &&
      fichaTecnicaById &&
      Object.keys(fichaTecnicaById).length > 0
    ) {
      setTimeout(() => {
        if (fichaTecnicaById.dependencia_interna?.dependencia?.id_dependencia) {
          setValue(
            "dependencia",
            fichaTecnicaById.dependencia_interna.dependencia.id_dependencia.toString()
          );
        }
      }, 100);
      reset({
        numero_patrimonio: fichaTecnicaById.numero_patrimonio || "",
        act_simple: fichaTecnicaById.act_simple || "",
        fecha_de_ingreso:
          fichaTecnicaById.fecha_de_ingreso ||
          new Date().toISOString().split("T")[0],
        usuario_pc: fichaTecnicaById.usuario_pc || "",
        contrasenia_pc: fichaTecnicaById.contrasenia_pc || "",
        anio_act_simple:
          fichaTecnicaById.anio_act_simple ||
          new Date().getFullYear().toString(),
        descripcion_user: fichaTecnicaById.descripcion_user || "",
        contacto_nombre: fichaTecnicaById.contacto_nombre || "",
        contacto_telefono: fichaTecnicaById.contacto_telefono || "",
        medio_solicitud: fichaTecnicaById.medio_solicitud || "",
        tipo_de_bien: fichaTecnicaById.tipo_de_bien || "",
        estado_del_bien: fichaTecnicaById.estado_del_bien || "",
      });
    }
  }, [isEditMode, fichaTecnicaById, reset, setValue]);

  // Reset dependencia interna when dependencia changes
  useEffect(() => {}, [selectedDepGral, setValue, isLoading]);
  useEffect(() => {
    if (selectedDepGral !== undefined && !isLoading) {
      setValue("id_dependencia_int_fk", "");
    }
    if (
      isEditMode &&
      fichaTecnicaById &&
      selectedDepGral && // Important - only run when main dependencia is selected
      dependenciasInternas.length > 0 // Important - only run when options are loaded
    ) {
      if (fichaTecnicaById.dependencia_interna?.id_dependencia_interna) {
        setValue(
          "id_dependencia_int_fk",
          fichaTecnicaById.dependencia_interna.id_dependencia_interna.toString()
        );
      }
    }
  }, [
    isEditMode,
    fichaTecnicaById,
    dependenciasInternas,
    selectedDepGral,
    setValue,
    isLoading,
  ]);
  const onSubmit = async (data) => {
    console.log(user);

    data.anio_act_simple = new Date().getFullYear().toString();
    data.id_user = user.id;
    console.log("Data a enviar:", data);

    try {
      let response;
      if (isEditMode) {
        response = await updateFichaTecnica(idFichaIngreso, data);
        navigate(`/ficha-ingreso/detail/${idFichaIngreso}`);
      } else {
        response = await createFichaTecnica(data);
        if (response.id_ficha_tecnica) {
          navigate(`/ficha-ingreso/detail/${response.id_ficha_tecnica}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {isEditMode
          ? `Editar Ficha Ingreso #${idFichaIngreso}`
          : "Nueva Ficha Ingreso"}
      </h2>

      {isLoading && isEditMode && !fichaTecnicaById ? (
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
                    {/* Medio Solicitud  */}
                    <FormField
                      control={control}
                      name="medio_solicitud"
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
                    {/* Tipo de */}
                    <FormField
                      control={control}
                      name="tipo_de_bien"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Bien </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione de Tipos de Bien" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIPOS_BIENES.map((bien) => (
                                <SelectItem key={bien.value} value={bien.value}>
                                  {bien.label}
                                </SelectItem>
                              ))}
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
                    {/* Numero de Patrimono */}
                    <FormField
                      control={control}
                      name="numero_patrimonio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numero de Patrimonio</FormLabel>
                          <FormControl>
                            <Input
                              type={"number"}
                              {...field}
                              className="w-full"
                              placeholder="Ingrese el numero de patrimonio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Fecha Ingreso */}
                    <FormField
                      control={control}
                      name="fecha_de_ingreso"
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
                      name="estado_del_bien"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado del Bien </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {allowedStates().map((state) => (
                                <SelectItem key={state} value={state} className="capitalize">
                                  {state === "ingreso"
                                    ? "📥 Ingreso"
                                    : state === "salida"
                                    ? "📤 Salida"
                                    : state === "retirada"
                                    ? "🚚 Retirada"
                                    : state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Dependencia */}

                    <FormField
                      control={control}
                      name="dependencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dependencia</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value} // Add this critical prop
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione la dependencia " />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dependencias.map((dependencia) => (
                                <SelectItem
                                  key={dependencia.id_dependencia}
                                  value={dependencia.id_dependencia.toString()}
                                >
                                  {dependencia.dep_gral}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Dependencia Interna*/}
                    <FormField
                      control={control}
                      // name="dependenciaInterna" //id_dependencia_int_fk
                      name="id_dependencia_int_fk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dependencia Interna</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!selectedDepGral}
                            value={field.value} // Add this critical prop
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    !selectedDepGral
                                      ? "Primero seleccione una dependencia"
                                      : "Seleccione la Dependencia Interna"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                // Filtramos las dependencias internas por la dependencia seleccionada
                                dependenciasInternas.length > 0 &&
                                  dependenciasInternas.map((dependencia) => (
                                    <SelectItem
                                      key={dependencia.id_dependencia_interna}
                                      value={dependencia.id_dependencia_interna.toString()}
                                    >
                                      {dependencia.dep_interna}
                                    </SelectItem>
                                  ))
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Descripción Usuario */}
                    <FormField
                      control={control}
                      name="descripcion_user"
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
                      name="contacto_nombre"
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
                      name="contacto_telefono"
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
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditMode ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
