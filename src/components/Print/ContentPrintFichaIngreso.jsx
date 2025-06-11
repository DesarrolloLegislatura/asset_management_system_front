import { Computer } from "lucide-react";

export const ContentPrintFichaIngreso = ({ fichaTecnicaById }) => {
  return (
    <div className="print:page-break-inside-avoid print:h-[138mm] print:overflow-hidden print:w-full print:p-2 print:border-box print:relative">
      {/* Encabezado */}
      <div className="flex justify-between items-center print:mb-[1px]">
        {/* Logo positioned to the left */}
        <div className="flex-shrink-0">
          <img
            src="/assets/svg/pl_logo.svg"
            alt="Logo"
            className="h-16 w-auto print:h-14 print:w-auto print:filter print:grayscale print:contrast-125"
          />
        </div>

        {/* Date and number of the document - positioned to the right */}
        <div className="flex-shrink-0 flex flex-col items-end">
          <img
            src="/assets/images/qr.png"
            alt="QR"
            className="h-20 w-auto print:h-14 print:w-auto print:filter print:grayscale print:contrast-125 print:mr-5"
          />
          <p className="text-sm print:text-[16px] font-bold text-right print:text-black">
            Ficha:{" "}
            <span className="font-normal print:font-medium">
              N°{fichaTecnicaById.id || ""}
            </span>
          </p>
        </div>
      </div>

      {/* Titulo */}
      <div className="text-center mb-2 print:mb-[3px] print:border-b-2 print:border-black print:pb-1">
        <h1 className="text-4xl font-semibold uppercase underline print:text-[19px] print:text-black print:font-bold">
          Servicio Técnico
        </h1>
        <h2 className="text-lg font-light uppercase print:text-[12px] print:text-black print:font-medium">
          Ficha de ingreso del bien
        </h2>
      </div>

      <div className="mb-1 p-1 print:mb-[2px] print:p-[1px]">
        {/* Encabezado de sección optimizado para B&N */}
        <div className="print:bg-gray-300 print:text-white print:p-1 print:mb-2 print:rounded-none">
          <h3 className="font-bold mb-1 text-sm text-gray-900 uppercase pb-1 print:text-xs print:text-white print:mb-0 flex items-center">
            <Computer className="mr-1 print:hidden" size="{15}" />
            <span className="print:block print:font-bold">
              📋 INFORMACIÓN DEL BIEN
            </span>
          </h3>
        </div>

        {/* Grid con bordes mejorados para impresión */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 print:gap-1 mb-3 print:mb-[4px] print:text-[11px] print:border print:border-black">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Estado:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.status_users[0].status.name}
            </span>
          </div>
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Tipo del Bien:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.asset.typeasset.name || ""}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              N° de Inventario:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.asset.inventory || ""}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 print:gap-1 mb-3 print:mb-[4px] print:text-[11px] print:border print:border-black print:border-t-0">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Fecha Ingreso:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.date_in || ""}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              Act. Simple:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">{`${fichaTecnicaById.act_simple}/${fichaTecnicaById.year_act_simple}`}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 print:gap-1 mb-2 print:mb-[4px] print:text-[11px] print:border print:border-black print:border-t-0">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Área:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.asset.area.name || ""}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              Edificio:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.asset.building.name || ""}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 print:gap-1 mb-3 print:mb-[6px] print:text-[11px] print:border print:border-black print:border-t-0">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Usuario PC:
            </span>
            <span className="print:text-black print:font-normal">
              {fichaTecnicaById.user_pc || ""}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              Contraseña PC:
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.pass_pc || ""}
            </span>
          </div>
        </div>

        {/* Descripción del problema con mejor contraste */}
        <div className="print:mb-[8px] print:text-[11px] print:p-0">
          <h3 className="font-bold mb-2 print:mb-[2px] print:text-black print:font-bold print:text-[12px]">
            Descripción del Problema por el usuario:
          </h3>
          <div className="border border-dotted border-gray-200 print:border-2 print:border-black print:border-solid rounded-sm p-2 print:p-2 print:min-h-[15mm]">
            <p className="text-justify print:pb-1 print:text-black print:leading-tight print:text-[10px]">
              {fichaTecnicaById.user_description || "Sin descripción"}
            </p>
          </div>
        </div>
      </div>

      {/* Sección de contacto mejorada */}
      <div className="mb-10 p-1 print:mb-[8px] print:p-[1px]">
        <div className="print:bg-gray-300 print:text-white print:p-1 print:mb-2">
          <h3 className="font-bold mb-1 text-sm text-whiteuppercase pb-1 print:text-xs print:text-white print:mb-0 flex items-center">
            <Computer className="mr-1 print:hidden" size="{15}" />
            <span className="print:block print:font-bold">
              👤 INFORMACIÓN DE CONTACTO
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 print:gap-1 print:text-[11px] print:border print:border-black">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Nombre Completo:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.contact_name || ""}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              Teléfono:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaTecnicaById.contact_phone || ""}
            </span>
          </div>
        </div>
      </div>

      {/* Firma mejorada */}
      <div className="hidden print:flex print:absolute print:bottom-[34px] print:right-0 print:mr-4 print:z-10">
        <div className="border-dotted border-t-2 border-black w-40 text-center">
          <h3 className="font-light print:mt-1 print:text-[10px] print:text-black print:font-medium">
            Firma y Sello
          </h3>
        </div>
      </div>

      {/* Footer optimizado para B&N */}
      <div
        id="pie"
        className="hidden print:block print:absolute print:bottom-0 print:left-0 print:right-0 print:w-full print:bg-white print:border-t-1 print:border-black print:pt-1 print:pb-1"
      >
        <p className="text-[9px] leading-tight text-center print:text-black print:font-medium">
          <span className="font-bold print:font-bold">
            DIRECCIÓN DE SISTEMAS Y COMUNICACIONES{" "}
          </span>{" "}
          - José María Paz Nº 170, 1° Piso, Resistencia, Chaco - Tel: 4429149 -{" "}
          <b className="print:font-bold">Dir: Francisco Javier Fariña</b>
        </p>
      </div>
    </div>
  );
};
