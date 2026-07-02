export const ContentPrintFichaSalida = ({ fichaTecnicaById, ingreso }) => {
  return (
    <div className="print:page-break-inside-avoid print:h-[68mm] print:overflow-hidden print:w-full print:p-2 print:border-box print:relative">
      {/* Encabezado */}
      <div className="flex justify-between items-center ">
        {/* Logo positioned to the left */}
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
            Ficha de {ingreso ? "Constancia de Retiro" : "de salida"}
          </h2>
        </div>

        <div className="flex-shrink-1 flex flex-col items-center print:mr-2 print:mt-1">
          <h2 className="text-lg font-light uppercase print:text-[12px] print:text-black print:font-medium print:mb-1 print:text-center">
            Ficha N°:{" "}
            <span className="font-bold print:text-black print:font-bold">
              {fichaTecnicaById.id || ""}
            </span>
          </h2>
        </div>
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
                ? new Date(
                    fichaTecnicaById.date_out + "T12:00:00"
                  ).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
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
