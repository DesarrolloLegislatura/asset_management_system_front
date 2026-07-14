import { useRef } from "react";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";

const formatDate = (date) => {
  if (!date) return "Sin fecha";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const getCurrentStatus = (ficha) => {
  if (
    ficha.status_users &&
    Array.isArray(ficha.status_users) &&
    ficha.status_users.length > 0 &&
    ficha.status_users[0].status &&
    ficha.status_users[0].status.name
  ) {
    return ficha.status_users[0].status.name;
  }
  return null;
};

export const FichaListPrint = ({ table }) => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
    @page {
      size: A4 landscape;
      margin: 10mm;
    }
    @media print {
      html, body {
        font-family: 'Arial', sans-serif;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      * {
        color: black !important;
        border-color: black !important;
      }
    }
    `,
    documentTitle: "Listado de Fichas de Ingreso",
  });

  // Filas filtradas y ordenadas, ignorando la paginación
  const rows = table.getPrePaginationRowModel().rows;

  const today = new Date().toLocaleDateString("es-AR");

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={reactToPrintFn}
        disabled={rows.length === 0}
        title="Imprimir listado"
      >
        <Printer className="h-4 w-4" />
        Imprimir Listado
      </Button>

      <div className="hidden print:block" ref={contentRef}>
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-4 print:border-b print:border-black print:pb-2">
          <img
            src="/assets/svg/pl_logo.svg"
            alt="Logo"
            className="h-12 w-auto print:filter print:grayscale"
          />
          <div className="text-center">
            <h1 className="text-lg font-bold uppercase">Servicio Técnico</h1>
            <h2 className="text-sm font-medium">
              Listado de Fichas de Ingreso
            </h2>
          </div>
          <div className="text-right text-xs">
            <p>Fecha: {today}</p>
            <p>Total: {rows.length} fichas</p>
          </div>
        </div>

        {/* Tabla */}
        <table className="w-full table-fixed border-collapse text-[10px]">
          <colgroup>
            <col style={{ width: "7%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "36%" }} />
          </colgroup>
          <thead>
            <tr>
              <th className="border border-black p-1 text-left">N° de Ficha</th>
              <th className="border border-black p-1 text-left">
                N° de Inventario
              </th>
              <th className="border border-black p-1 text-left">
                Tipo de Equipo
              </th>
              <th className="border border-black p-1 text-left">
                Fecha Ingreso
              </th>
              <th className="border border-black p-1 text-left">Estado</th>
              <th className="border border-black p-1 text-left">Área</th>
              <th className="border border-black p-1 text-left">
                Descripción de la Resolución
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const ficha = row.original;
              const status = getCurrentStatus(ficha);
              return (
                <tr key={ficha.id} className="print:break-inside-avoid">
                  <td className="border border-black p-1">{ficha.id}</td>
                  <td className="border border-black p-1 break-words">
                    {ficha.asset?.inventory ?? ""}
                  </td>
                  <td className="border border-black p-1 break-words">
                    {ficha.asset?.typeasset?.name ?? ""}
                  </td>
                  <td className="border border-black p-1">
                    {formatDate(ficha.date_in)}
                  </td>
                  <td className="border border-black p-1 uppercase break-words">
                    {status ?? "Sin estado"}
                  </td>
                  <td className="border border-black p-1 break-words">
                    {ficha.area?.name ?? ficha.asset?.area?.name ?? ""}
                  </td>
                  <td className="border border-black p-1 whitespace-pre-wrap break-words">
                    {ficha.tech_description ?? ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

FichaListPrint.propTypes = {
  table: PropTypes.object.isRequired,
};
