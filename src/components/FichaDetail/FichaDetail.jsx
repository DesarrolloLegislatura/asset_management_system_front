import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoBienTab } from "./InfoBienTab";
import { InfoContactoTab } from "./InfoContactoTab";
import { ResolucionTecnicaTab } from "./ResolucionTecnicaTab";
import { EstadosTab } from "./EstadosTab";

export const FichaDetail = ({ fichaTecnicaById }) => {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid grid-cols-4  w-full mb-10  max-w-2xl m">
        <TabsTrigger value="info">Info del Bien</TabsTrigger>
        <TabsTrigger value="contact">Info de Contacto</TabsTrigger>
        <TabsTrigger value="tech">Resolución Técnica</TabsTrigger>
        <TabsTrigger value="states">Estados</TabsTrigger>
      </TabsList>

      <InfoBienTab fichaTecnicaById={fichaTecnicaById} />
      <InfoContactoTab fichaTecnicaById={fichaTecnicaById} />
      <ResolucionTecnicaTab fichaTecnicaById={fichaTecnicaById} />
      <EstadosTab fichaTecnicaById={fichaTecnicaById} />
    </Tabs>
  );
};
