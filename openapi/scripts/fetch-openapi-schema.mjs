// Descarga el schema del backend, lo convierte a OpenAPI 3.0 si es Swagger 2.0
// y escribe el snapshot versionado en openapi/schema.json.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import converter from "swagger2openapi";

const SCHEMA_URL = process.env.API_SCHEMA_URL;
if (!SCHEMA_URL) {
  console.error("Falta API_SCHEMA_URL (definila en .env; ver .env.example).");
  process.exit(1);
}

const OUT = fileURLToPath(new URL("../schema.json", import.meta.url));

const res = await fetch(SCHEMA_URL, {
  headers: { Accept: "application/json" },
  signal: AbortSignal.timeout(15_000),
});
if (!res.ok) {
  console.error(`Backend respondió ${res.status} ${res.statusText} para ${SCHEMA_URL}`);
  process.exit(1);
}
const raw = await res.json();

let spec;
if (raw.swagger === "2.0") {
  const { openapi } = await converter.convertObj(raw, { patch: true, warnOnly: true });
  spec = openapi;
  console.log("Schema Swagger 2.0 detectado -> convertido a OpenAPI 3.0.");
} else if (typeof raw.openapi === "string" && raw.openapi.startsWith("3.")) {
  spec = raw;
  console.log(`Schema OpenAPI ${raw.openapi} detectado -> sin conversión.`);
} else {
  console.error("El documento no es Swagger 2.0 ni OpenAPI 3.x. Abortando.");
  process.exit(1);
}

await writeFile(OUT, JSON.stringify(spec, null, 2) + "\n");
console.log(`Snapshot escrito en ${OUT}`);