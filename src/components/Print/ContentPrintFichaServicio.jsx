import { ClipboardList } from "lucide-react";
import PropTypes from "prop-types";

const formatDate = (dateStr) => {
  if (!dateStr) return "___/___/____";
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const ContentPrintFichaServicio = ({ fichaData, isTecnico }) => {
  const isEntrega = fichaData.record_type === "entrega";

  return (
    <div className="print:page-break-inside-avoid print:h-[138mm] print:overflow-hidden print:w-full print:p-2 print:border-box print:relative">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div className="flex-shrink-1">
          <img
            src="/assets/svg/pl_logo.svg"
            alt="Logo"
            className="h-14 w-auto print:h-14 print:w-auto print:filter print:grayscale print:contrast-125"
          />
        </div>
        <div className="flex-shrink-1 flex flex-col items-center print:mr-2 print:mt-12">
          <h1 className="text-4xl font-semibold uppercase underline print:text-[19px] print:text-black print:font-bold print:mb-1">
            Servicio Técnico
          </h1>
          <h2 className="text-lg font-light uppercase print:text-[12px] print:text-black print:font-medium print:mb-1 print:text-center">
            Ficha de {isEntrega ? "Entrega" : "Servicio"}
          </h2>
        </div>
        <div className="flex-shrink-1 flex flex-col items-center print:mr-2 print:mt-1 print:text-[11px] print:text-black print:text-right">
          <span className="font-bold">Fecha:</span>
          <span>{formatDate(fichaData.date)}</span>
        </div>
      </div>

      {/* Datos Generales */}
      <div className="mb-1 p-1 print:mb-[2px] print:p-[1px]">
        <div className="print:bg-gray-300 print:text-white print:p-1 print:mb-2 print:rounded-none">
          <h3 className="font-bold mb-1 text-sm uppercase pb-1 print:text-xs print:text-white print:mb-0 flex items-center">
            <ClipboardList className="mr-1 print:hidden" size={15} />
            <span className="print:block print:font-bold">
              📋 INFORMACIÓN GENERAL
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 print:gap-1 mb-3 print:mb-[4px] print:text-[11px] print:border print:border-black">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Área:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaData.area || "Sin datos"}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              Edificio:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaData.building || "Sin datos"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 print:gap-1 mb-3 print:mb-[4px] print:text-[11px] print:border print:border-black print:border-t-0">
          <div className="p-2 print:p-1 print:border-r print:border-black">
            <span className="font-bold print:text-black print:font-bold">
              Realizado por:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaData.performed_by || "Sin datos"}
            </span>
          </div>
          <div className="p-2 print:p-1">
            <span className="font-bold print:text-black print:font-bold">
              Tipo de Registro:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal uppercase">
              {isEntrega ? "Entrega de Bienes" : "Servicio Técnico"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 print:gap-1 mb-3 print:mb-[4px] print:text-[11px] print:border print:border-black print:border-t-0">
          <div className="p-2 print:p-1 print:col-span-2">
            <span className="font-bold print:text-black print:font-bold">
              N° de Patrimonio:{" "}
            </span>
            <span className="font-light print:text-black print:font-normal">
              {fichaData.patrimony_number || "Sin datos"}
            </span>
          </div>
        </div>

        {/* Sección condicional: Entrega */}
        {isEntrega && fichaData.goods?.length > 0 && (
          <>
            <div className="print:bg-gray-300 print:text-white print:p-1 print:mb-2 print:rounded-none">
              <h3 className="font-bold text-sm uppercase print:text-xs print:text-white print:mb-0">
                📦 BIENES ENTREGADOS
              </h3>
            </div>
            <table className="w-full print:text-[11px] print:border print:border-black print:mb-[4px]">
              <thead>
                <tr className="print:bg-gray-100">
                  <th className="p-2 print:p-1 print:border-r print:border-black text-left font-bold print:text-black">
                    Tipo de Bien
                  </th>
                  <th className="p-2 print:p-1 text-center font-bold print:text-black w-24">
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody>
                {fichaData.goods.map((item, index) => (
                  <tr key={index} className="print:border-t print:border-black">
                    <td className="p-2 print:p-1 print:border-r print:border-black print:text-black">
                      {item.asset_type || "Sin datos"}
                    </td>
                    <td className="p-2 print:p-1 text-center print:text-black">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Sección condicional: Servicios */}
        {!isEntrega && fichaData.services?.length > 0 && (
          <>
            <div className="print:bg-gray-300 print:text-white print:p-1 print:mb-2 print:rounded-none">
              <h3 className="font-bold text-sm uppercase print:text-xs print:text-white print:mb-0">
                🔧 SERVICIOS REALIZADOS
              </h3>
            </div>
            <div className="print:border print:border-black print:mb-[4px] print:text-[11px]">
              {fichaData.services.map((service, index) => (
                <div
                  key={index}
                  className={`p-2 print:p-1 print:text-black ${
                    index < fichaData.services.length - 1
                      ? "print:border-b print:border-black"
                      : ""
                  }`}
                >
                  • {service}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Observación */}
        {fichaData.observation && (
          <div className="print:mb-[8px] print:text-[11px] print:p-0">
            <h3 className="font-bold mb-2 print:mb-[2px] print:text-black print:font-bold print:text-[12px]">
              Observaciones:
            </h3>
            <div className="border border-dotted border-gray-200 print:border-2 print:border-black print:border-solid rounded-sm p-2 print:p-2 print:min-h-[10mm]">
              <p className="text-justify print:pb-1 print:text-black print:leading-tight print:text-[10px]">
                {fichaData.observation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Firma */}
      <div className="hidden print:flex print:absolute print:bottom-[34px] print:right-0 print:mr-4 print:z-10">
        <div className="border-dotted border-t-2 border-black w-40 text-center">
          <h3 className="font-light print:mt-1 print:text-[10px] print:text-black print:font-medium">
            Firma y Aclaración {isTecnico ? "del solicitante" : "del técnico"}
          </h3>
        </div>
      </div>

      {/* Footer */}
      <div
        id="pie"
        className="hidden print:block print:absolute print:bottom-0 print:left-0 print:right-0 print:w-full print:bg-white print:border-t-1 print:border-black print:pt-1 print:pb-1"
      >
        <p className="text-[9px] leading-tight text-center print:text-black print:font-medium">
          <span className="font-bold print:font-bold">
            DIRECCIÓN DE SISTEMAS Y COMUNICACIONES{" "}
          </span>
          — José María Paz Nº 170, 1° Piso, Resistencia, Chaco - Tel: 4429149 —{" "}
          <b className="print:font-bold">Dir: Francisco Javier Fariña</b>
        </p>
      </div>
    </div>
  );
};

ContentPrintFichaServicio.propTypes = {
  isTecnico: PropTypes.bool.isRequired,
  fichaData: PropTypes.shape({
    area: PropTypes.string,
    building: PropTypes.string,
    date: PropTypes.string,
    performed_by: PropTypes.string,
    patrimony_number: PropTypes.string,
    observation: PropTypes.string,
    record_type: PropTypes.oneOf(["servicio", "entrega"]),
    goods: PropTypes.arrayOf(
      PropTypes.shape({
        asset_type: PropTypes.string,
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
    services: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
