export const ContentPrintFichaSalida = ({ fichaTecnicaById, ingreso }) => {
  return (
    <div className="print:page-break-inside-avoid print:h-[68mm] print:overflow-hidden print:w-full print:p-2 print:border-box print:relative">
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
        <div className="flex-shrink-0">
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
          Ficha de {ingreso ? "Constancia de Retiro" : "de salida"}
        </h2>
      </div>

      {/* Contenido principal */}
      <div className="print:mb-4 print:text-[11px] print:text-black print:leading-relaxed print:p-2">
        <div className="print:mb-2">
          <p className="print:text-[13px] print:leading-relaxed">
            {ingreso ? (
              <>
                Se deja constancia de que el agente{" "}
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.retired_by || "________________________"}
                </span>
                , del área
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.area?.name ||
                    "________________________"}
                </span>{" "}
                , procede a retirar el bien que se detalla a continuación:
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.typeasset?.name ||
                    "________________________"}
                </span>
                , N° de inventario:
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.inventory ||
                    "________________________"}
                </span>
              </>
            ) : (
              <>
                Se autoriza a
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.retired_by || "________________________"}
                </span>
                , del área
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.area?.name ||
                    "________________________"}
                </span>
                , a retirar el bien que se detalla a continuación:
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.typeasset?.name ||
                    "________________________"}
                </span>
                , N° de inventario:
                <span className="print:border-b print:border-dotted print:border-black print:px-2 print:mx-1 print:font-bold">
                  {fichaTecnicaById.asset?.inventory ||
                    "________________________"}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="print:mb-2">
          <p className="print:text-[13px] print:leading-relaxed print:text-black">
            <span className="print:font-medium">Fecha Retiro: </span>
            <span>
              {fichaTecnicaById.date_out
                ? new Date(fichaTecnicaById.date_out).toLocaleDateString(
                    "es-AR"
                  )
                : "___/___/____"}
            </span>
          </p>
          {/* Firma mejorada */}
          <div className="hidden print:flex print:absolute print:bottom-[34px] print:right-0 print:mr-4 print:z-10">
            <div className="border-dotted border-t-2 border-black w-40 text-center">
              <h3 className="font-light print:mt-1 print:text-[10px] print:text-black print:font-medium">
                Firma y Aclaración
              </h3>
            </div>
          </div>
        </div>
        {/* Footer optimizado para B&N */}
        <div
          id="pie"
          className="hidden print:block print:absolute print:bottom-0 print:left-0 print:right-0 print:w-full print:bg-white print:border-t-1 print:border-black print:pt-1 print:pb-1"
        >
          <p className="text-[9px] leading-tight text-center print:text-black print:font-medium">
            <span className="font-bold print:font-bold">
              DIRECCIÓN DE SISTEMAS Y COMUNICACIONES
            </span>{" "}
            - José María Paz Nº 170, 1° Piso, Resistencia, Chaco - WhatsApp:
            362-4565024 -{" "}
            <b className="print:font-bold">Dir: Francisco Javier Fariña</b>
          </p>
        </div>
      </div>
    </div>
  );
};
