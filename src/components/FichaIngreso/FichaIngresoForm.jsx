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
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";
import { InventorySerch } from "../Iventario/InventorySerch";

export function FichaIngresoForm() {
  const { idFichaIngreso } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { fichaTecnicaById, createFichaTecnica, updateFichaTecnica } =
    useFichaTecnica();
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
      medio_solicitud: "",
      status: "ingreso",
    },
  });
  const { control, handleSubmit, setValue, reset } = form;

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (
      isEditMode &&
      fichaTecnicaById &&
      Object.keys(fichaTecnicaById).length > 0
    ) {
      reset({
        inventory: fichaTecnicaById.inventory || "",
        typeasset: fichaTecnicaById.typeasset || "",
        area: fichaTecnicaById.area || "",
        building: fichaTecnicaById.building || "",
        act_simple: fichaTecnicaById.act_simple || "",
        date_in:
          fichaTecnicaById.date_in || new Date().toISOString().split("T")[0],
        usuario_pc: fichaTecnicaById.usuario_pc || "",
        contrasenia_pc: fichaTecnicaById.contrasenia_pc || "",
        year_act_simple:
          fichaTecnicaById.year_act_simple ||
          new Date().getFullYear().toString(),
        user_description: fichaTecnicaById.user_description || "",
        contact_name: fichaTecnicaById.contact_name || "",
        contact_phone: fichaTecnicaById.contact_phone || "",
        medio_solicitud: fichaTecnicaById.medio_solicitud || "",
        status: fichaTecnicaById.status || "",
      });
    }
  }, [isEditMode, fichaTecnicaById, reset, setValue]);

  const onSubmit = async (data) => {
    console.log(user);

    data.year_act_simple = new Date().getFullYear().toString();
    data.id_user = user.id;
    console.log("Data a enviar:", data);

    try {
      let response;
      if (isEditMode) {
        response = await updateFichaTecnica(idFichaIngreso, data);
        navigate(`/ficha-ingreso/detail/${idFichaIngreso}`);
      } else {
        response = await createFichaTecnica(data);
        console.log("Response from API:", response); // Log API response
        if (response.asset) {
          navigate(`/ficha-ingreso/detail/${response}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInventoryChange = (inventoryValue, fichaTecnicaById) => {
    setValue("inventory", inventoryValue, { shouldValidate: true });
    setValue("asset", fichaTecnicaById, {
      shouldValidate: true,
    });
  };

  const handleTypeassetChange = (typeasset) => {
    setValue("typeasset", typeasset, { shouldValidate: true });
  };

  const handleAreaChange = (area) => {
    setValue("area", area, { shouldValidate: true });
  };

  const handleBuildingChange = (building) => {
    setValue("building", building, { shouldValidate: true });
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
                    {/* Numero de Patrimono */}

                    <FormField
                      control={control}
                      name="inventory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numero de Patrimonio</FormLabel>
                          <FormControl>
                            <InventorySerch
                              value={field.value}
                              onChange={handleInventoryChange}
                              onTypeassetChange={handleTypeassetChange}
                              onAreaChange={handleAreaChange}
                              onBuildingChange={handleBuildingChange}
                              disabled={isEditMode}

                              // error={errors.inventory?.message}
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
                              <SelectItem value={1}>📥 Ingreso</SelectItem>
                              {idFichaIngreso && (
                                <>
                                  <SelectItem value={2}>📤 Salida</SelectItem>
                                  <SelectItem value={3}>🚚 Retirada</SelectItem>
                                </>
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
