# Plan: Implementar openapi-typescript (tipado end-to-end de la capa API)

> **Estado**: PENDIENTE
> **Decisiones de diseño**: spec desde URL del backend con snapshot versionado · se mantiene axios (sin openapi-fetch) · alcance: infraestructura + piloto `assetsService`.
> **Continuación de**: `plan/migracion-incremental-typescript.md` (que dejó explícitamente fuera de alcance "automatizar openapi-typescript").

## Objetivo

Generar tipos TypeScript desde el schema OpenAPI del backend Django (drf-yasg), versionando un snapshot del spec en `openapi/`, manteniendo `axiosService` y sus interceptores de refresh JWT intactos, y migrando **un solo servicio piloto** (`inventario/assetsService` + `useAsset`) como patrón replicable para el resto de servicios.

El proyecto ya tuvo esto funcionando (el commit `311ff08` borró un `src/types/api.d.ts` generado y `91ef83d` borró `swagger.json`/`swagger-v3.json`); este plan lo reintroduce con pipeline automatizado en lugar de conversión manual.

## Por qué estas decisiones

- **openapi-typescript 7.x** solo acepta OpenAPI 3.0/3.1. drf-yasg emite Swagger 2.0, así que el pipeline convierte con `swagger2openapi` (el `swagger-v3.json` histórico era exactamente esa conversión, hecha a mano). La detección es por contenido del JSON, así que si el backend migra a drf-spectacular (3.x nativo) el pipeline sigue funcionando sin cambios.
- **Se mantiene axios**: los interceptores actuales (refresh proactivo + cola de peticiones tras 401) funcionan y reescribirlos como middleware de openapi-fetch es riesgo innecesario ahora. Contrapartida asumida: las URLs y params no se validan en compilación; solo se tipan requests/responses. openapi-fetch queda documentado como evolución futura.
- **Snapshot committeado** (`openapi/schema.json` + `src/types/api.d.ts`): builds reproducibles, CI y editor funcionan sin acceso a la IP LAN del backend, y el diff del snapshot en los PRs documenta los cambios de contrato.

## 1. Paquetes (devDependencies, pnpm con save-exact)

```bash
pnpm add -D openapi-typescript swagger2openapi
```

| Paquete | Rol |
|---|---|
| `openapi-typescript` 7.x | Genera `src/types/api.d.ts` desde el snapshot. DevDep fijado (no npx efímero) para salida reproducible entre máquinas. Requiere Node ≥20 (local: v24, OK). |
| `swagger2openapi` | Conversión Swagger 2.0 → OpenAPI 3.0, usada programáticamente en el script de descarga. |

**No instalar** `openapi-typescript-helpers` (orientado a openapi-fetch; escribimos ~30 líneas de helpers propios) ni `dotenv` (Node ≥20.6 soporta `--env-file`).

## 2. Pipeline de generación

### 2.1 Variables de entorno

La generación corre en **Node**, no en Vite → la variable del schema **no lleva prefijo `VITE_`** (no debe llegar al bundle del cliente).

`.env` (gitignoreado — cada dev actualiza el suyo):
```bash
# OJO: la IP actual "192.168.103" tiene 3 octetos (inválida). Confirmar la IP real en F1.
VITE_API_URL=http://<ip-backend>:9002/api/
API_SCHEMA_URL=http://<ip-backend>:9002/api/swagger.json
```

Crear y committear `.env.example` (hoy no existe) con esas dos variables documentadas y el resto de las `VITE_*` existentes con placeholders.

Candidatos de URL del schema según generador del backend (confirmar en F1):
- drf-yasg: `<base>/swagger.json` (nota: `?format=openapi` en drf-yasg **también devuelve 2.0**; el nombre engaña)
- drf-spectacular: `<base>/schema/?format=json`

### 2.2 Script de descarga + conversión: `scripts/fetch-openapi-schema.mjs` (nuevo)

```js
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

const OUT = fileURLToPath(new URL("../openapi/schema.json", import.meta.url));

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
```

Notas:
- `patch: true, warnOnly: true`: los specs de drf-yasg suelen tener imperfecciones menores; convertir con parches en vez de abortar (revisar warnings en la salida).
- Pretty-print estable (2 espacios + newline final) → diffs de git legibles.
- Si el endpoint del schema requiriese auth, basta añadir el header al `fetch` del script (anotado en la doc; no implementar salvo necesidad).

### 2.3 Scripts npm (`package.json`)

```jsonc
"scripts": {
  "dev": "vite",
  "build": "pnpm api:check && tsc --noEmit && vite build",
  "typecheck": "tsc --noEmit",
  "api:schema": "node --env-file-if-exists=.env scripts/fetch-openapi-schema.mjs",
  "api:types": "openapi-typescript openapi/schema.json -o src/types/api.d.ts --alphabetize",
  "api:generate": "pnpm api:schema && pnpm api:types",
  "api:check": "openapi-typescript openapi/schema.json -o src/types/api.d.ts --check"
}
```

- `--env-file-if-exists` (Node ≥22): no rompe donde no hay `.env`. `api:types` y `api:check` **no necesitan red ni `.env`**: leen el snapshot committeado.
- `--alphabetize`: orden estable de claves → diffs mínimos al regenerar.
- **Sin `--enum`** (emitiría enums con runtime, incompatible con salida `.d.ts` y `verbatimModuleSyntax`; los string-literal unions por defecto son lo correcto). Sin `--root-types` (los helpers de la sección 3 dan mejor ergonomía).
- `api:check` antepuesto a `build`: detecta drift **snapshot↔tipos** offline (alguien editó `api.d.ts` a mano o committeó snapshot sin regenerar). El drift **backend↔snapshot** no es verificable sin red: procedimiento manual documentado → `pnpm api:generate && git diff --stat openapi src/types` cuando cambie el backend.

### 2.4 Versionado

Se **committean ambos artefactos** (`openapi/schema.json` y `src/types/api.d.ts`), coherente con el estado previo a `311ff08`. Sin cambios en `.gitignore`. Regla: nunca editarlos a mano; regenerar con `pnpm api:generate`.

## 3. Helpers de tipos: `src/shared/api/types.ts` (nuevo)

Aplanan el acceso a `paths[P][M]["responses"][code]["content"]["application/json"]` para uso con axios. (openapi-typescript declara los 8 métodos HTTP en cada path — los ausentes como `never` — así que `paths[P][M]` siempre es indexable.)

```ts
// Helpers para extraer tipos de src/types/api.d.ts (generado por openapi-typescript).
// Solo operan a nivel de tipos; el cliente HTTP sigue siendo axiosService.
import type { paths, components } from "@/types/api";

export type HttpMethod =
  | "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "trace";

/** Acceso directo a un schema por nombre: Schema<"Asset"> */
export type Schema<K extends keyof components["schemas"]> =
  components["schemas"][K];

/** Objeto operation de un path+método. `never` si el método no existe. */
export type ApiOperation<P extends keyof paths, M extends HttpMethod> =
  NonNullable<paths[P][M]>;

type JsonOf<T> = T extends { content: { "application/json": infer J } } ? J : never;
type SuccessCode = 200 | 201 | 202 | 204;

/** Cuerpo JSON de la respuesta 2xx: ApiResponse<"/tds/assets", "get"> */
export type ApiResponse<P extends keyof paths, M extends HttpMethod> =
  ApiOperation<P, M> extends { responses: infer R }
    ? { [S in Extract<keyof R, SuccessCode>]: JsonOf<R[S]> }[Extract<keyof R, SuccessCode>]
    : never;

/** Cuerpo JSON del request: ApiRequestBody<"/auth/login/", "post"> */
export type ApiRequestBody<P extends keyof paths, M extends HttpMethod> =
  ApiOperation<P, M> extends { requestBody?: infer B } ? JsonOf<NonNullable<B>> : never;

/** Query params: ApiQuery<"/tds/assets", "get"> */
export type ApiQuery<P extends keyof paths, M extends HttpMethod> =
  ApiOperation<P, M> extends { parameters: { query?: infer Q } }
    ? NonNullable<Q>
    : never;

/** Path params: ApiPathParams<"/tds/tds/{id}/", "get"> */
export type ApiPathParams<P extends keyof paths, M extends HttpMethod> =
  ApiOperation<P, M> extends { parameters: { path: infer PP } } ? PP : never;
```

- Respeta la convención del repo: `shared` solo importa de `src/types/`, nunca de features.
- `verbatimModuleSyntax` exige los `import type` tal como están escritos.
- Los condicionales dependen de la forma exacta que emita el generador con el spec real: validar en F3 y ajustar si hiciera falta (p. ej. 204 sin `content` colapsa a `never`, que es correcto).

## 4. Patrón de servicio tipado (piloto: inventario)

Piloto elegido: `GET /tds/assets` — un método, un hook (`useAsset`), un consumidor (`InventorySerch.jsx`). Superficie mínima para validar el pipeline de punta a punta.

### 4.1 `src/features/inventario/api/assetsService.js` → `.ts` (git mv + tipado)

```ts
import axiosService from "@/shared/api/axiosService";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/shared/api/types";

/** Respuesta de GET /tds/assets según el contrato del backend. */
export type AssetListResponse = ApiResponse<"/tds/assets", "get">;
/** Un asset individual (si el backend pagina estilo DRF: AssetListResponse["results"][number]). */
export type Asset = AssetListResponse[number];

const assetsService = {
  getAllAssets: (): Promise<AxiosResponse<AssetListResponse>> =>
    axiosService.get<AssetListResponse>("/tds/assets"),
};

export default assetsService;
```

Claves del patrón:
- El literal del helper (`"/tds/assets"`) debe coincidir con la clave real en `paths` del spec (ojo con barras finales); si difiere, TypeScript lo marca en compilación — ajustar según el snapshot real en F4.
- El servicio exporta **alias de dominio** (`Asset`, `AssetListResponse`) para que hooks/componentes no dependan de literales de path.
- `axiosService.d.ts` ya declara `AxiosInstance` → `axiosService.get<T>` devuelve `AxiosResponse<T>` sin tocar interceptores.

### 4.2 `src/features/inventario/hooks/useAsset.js` → `.ts`

```ts
import assetsService from "../api/assetsService";
import type { Asset } from "../api/assetsService";
import { useCallback, useEffect, useState } from "react";

export const useAsset = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllAssets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await assetsService.getAllAssets();
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAssets();
  }, [fetchAllAssets]);

  return { assets, fetchAllAssets, loading };
};
```

- `setAssets(response.data)` queda verificado contra el contrato: si el backend pagina (`{count, results}` de DRF), **falla en compilación** y obliga a `response.data.results` — exactamente el tipo de bug que el piloto debe demostrar que atrapa.
- `InventorySerch.jsx` (JS no chequeado) no requiere cambios; los imports sin extensión resuelven igual al `.ts` y hereda autocompletado en el editor.

### 4.3 Documentación del patrón: `docs/api-types.md` (nuevo)

Contenido: comandos del pipeline; receta de 5 pasos para migrar un servicio (renombrar a `.ts` → definir alias con `ApiResponse<...>`/`ApiRequestBody<...>` → tipar métodos con `AxiosResponse<T>` → tipar el hook → `pnpm typecheck`); regla "nunca editar `openapi/schema.json` ni `src/types/api.d.ts` a mano"; procedimiento de drift manual; ejemplo con path param para servicios futuros (`fichaTecnicaService`): `` axiosService.get<Ficha>(`/tds/tds/${id}/`) `` + `ApiPathParams<"/tds/tds/{id}/", "get">`.

## 5. Cambios de configuración (resumen)

| Archivo | Cambio |
|---|---|
| `package.json` | 2 devDeps + 4 scripts `api:*` + `api:check` antepuesto a `build` |
| `.env` | Corregir IP de `VITE_API_URL` (la actual `192.168.103` tiene 3 octetos) + añadir `API_SCHEMA_URL` |
| `.env.example` | Crear y committear |
| `scripts/fetch-openapi-schema.mjs` | Crear (el directorio `scripts/` no existe aún) |
| `.gitignore`, `vite.config.js` | Sin cambios |
| `tsconfig.json` | Sin cambios, salvo F6 opcional (`noUncheckedIndexedAccess`) |

## 6. Fases

### F1 — Descubrimiento del schema y saneo de entorno (riesgo: medio — depende del backend)
- [ ] Confirmar con `curl` (o con el equipo de backend) la URL exacta del schema y su formato (`swagger: "2.0"` vs `openapi: "3.x"`).
- [ ] **Gate bloqueante**: verificar que `/tds/assets` y demás endpoints vivos aparecen en el schema (el `swagger.json` histórico NO documentaba `/tds/*`; si el actual tampoco, el backend debe actualizar su documentación antes de continuar).
- [ ] Corregir `VITE_API_URL` en `.env` local (IP válida) y validar la app en dev (`pnpm dev`, login + inventario).
- [ ] Crear `.env.example`.
- **Done cuando**: `curl -s "$API_SCHEMA_URL"` devuelve JSON con clave `swagger` u `openapi` y contiene `"/tds/assets"`.

### F2 — Pipeline de generación (riesgo: bajo)
- [ ] `pnpm add -D openapi-typescript swagger2openapi`.
- [ ] Crear `scripts/fetch-openapi-schema.mjs`.
- [ ] Añadir scripts `api:*` a `package.json` (aún sin tocar `build`).
- [ ] `pnpm api:generate`; inspeccionar `openapi/schema.json` (3.x válido) y `src/types/api.d.ts` (existe `paths["/tds/assets"]` y el schema del asset en `components["schemas"]`).
- [ ] Committear snapshot + tipos.
- **Done cuando**: `pnpm api:generate` es idempotente (segunda corrida → `git status` limpio), `api:check` y `typecheck` pasan.

### F3 — Helpers de tipos (riesgo: bajo)
- [ ] Crear `src/shared/api/types.ts`.
- [ ] Validar los helpers contra el spec real (hover en editor sobre `ApiResponse<"/tds/assets", "get">`; una ruta inexistente debe dar error de compilación). Usar archivo de prueba temporal, borrarlo antes de commit.
- **Done cuando**: `pnpm typecheck` pasa y los helpers resuelven los tipos esperados.

### F4 — Piloto assetsService + useAsset (riesgo: bajo)
- [ ] `git mv assetsService.js assetsService.ts` + tipar (ajustar literal de path y shape array-vs-paginado según el spec real).
- [ ] `git mv useAsset.js useAsset.ts` + tipar.
- [ ] Verificar que `InventorySerch.jsx` no requiere cambios.
- **Done cuando**: `typecheck` y `build` pasan; en dev contra el backend la vista de inventario lista assets; prueba negativa: cambiar temporalmente el path a `"/tds/asset"` rompe el typecheck.

### F5 — Guard de build + documentación (riesgo: bajo)
- [ ] Anteponer `pnpm api:check &&` al script `build`.
- [ ] Escribir `docs/api-types.md`.
- **Done cuando**: editar una línea de `src/types/api.d.ts` a mano hace fallar `pnpm build`; revertir → build verde.

### F6 (opcional) — `noUncheckedIndexedAccess` (riesgo: medio)
- [ ] Medir impacto: `npx tsc --noEmit --noUncheckedIndexedAccess`.
- [ ] Si ≤5 errores triviales en los `.ts` existentes: corregir y activar en `tsconfig.json`; si no, documentar como deuda y cerrar.
- **Done cuando**: decisión tomada y typecheck verde en la configuración elegida.

## 7. Verificación final (tras F5)

1. `pnpm typecheck` y `pnpm build` verdes.
2. `pnpm api:generate` desde cero → `git status` limpio (idempotencia).
3. Flujo en dev con backend: login → inventario renderiza; en la pestaña Network la petición va a `http://<ip>:9002/api/tds/assets` (no a una ruta relativa del dev server).
4. Caso de error: backend apagado → `useAsset` cae al `catch` y `loading` vuelve a `false` (comportamiento actual preservado).
5. Simulación de drift: editar `openapi/schema.json` (renombrar un campo) → `api:check` falla → `pnpm api:types` lo repara.

## 8. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Backend en IP LAN inaccesible (CI, otra red) | `api:schema` falla | Solo `api:generate` requiere red; `check`/`types`/`build`/`typecheck` usan el snapshot committeado. Timeout 15 s y error claro en el script. |
| Conversión 2.0→3.0 imperfecta (drf-yasg emite specs laxos) | Tipos incorrectos | `patch+warnOnly` en swagger2openapi; revisar warnings; inspección manual del `api.d.ts` del endpoint piloto en F2. Peor caso: corregir el spec **en el backend**, nunca editar el snapshot a mano. |
| El schema no documenta `/tds/*` (como el histórico) | Bloquea todo el valor del plan | Gate explícito en F1 antes de instalar nada. |
| Drift silencioso backend↔snapshot | Tipos que mienten en runtime | `api:check` cubre snapshot↔tipos; para backend↔snapshot: regenerar al cambiar el backend + el diff del snapshot en PRs como registro del contrato. |
| IP malformada en `.env` (`192.168.103`, 3 octetos) | Peticiones fallan en dev | Corregir en F1 (prerrequisito del smoke test); `.env.example` con formato correcto. `.env` está gitignoreado: avisar al equipo. |
| Convivencia con `.d.ts` manuales (`axiosService.d.ts`) | Ninguno directo | Namespaces separados. Regla en la doc: `.d.ts` manuales tipan JS legacy; `api.d.ts` es solo-generado. |
| DRF paginado vs array plano en `/tds/assets` | `Asset = AssetListResponse[number]` no compila | Fallo en compile time, visible en F4; ajustar el alias según el spec real (previsto en 4.1). |
| `verbatimModuleSyntax` + olvido de `import type` | Error de build | Los snippets ya usan `import type`; el `tsc --noEmit` del build lo atrapa. |

## 9. Fuera de alcance explícito

- Migrar `authService`, `fichaTecnicaService`, `statusService` y sus hooks (planes futuros siguiendo `docs/api-types.md`).
- `openapi-fetch` o cualquier reemplazo del cliente axios y sus interceptores.
- TanStack Query u otra capa de data-fetching.
- Validación runtime de respuestas (Zod sobre los tipos generados).
- Tests automatizados.
- Migración masiva de `.js/.jsx` legacy o activar `checkJs`.

## Referencias

- [openapi-typescript — introducción](https://openapi-ts.dev/introduction) · [CLI](https://openapi-ts.dev/cli) · [ejemplos](https://openapi-ts.dev/examples)
- [openapi-fetch (evolución futura descartada por ahora)](https://openapi-ts.dev/openapi-fetch/) · [middleware & auth](https://openapi-ts.dev/openapi-fetch/middleware-auth)
- [swagger2openapi (npm)](https://www.npmjs.com/package/swagger2openapi)
- Histórico del repo: `git show 311ff08^:src/types/api.d.ts` (tipos generados previos) · `git show 91ef83d^:swagger-v3.json` (conversión 2.0→3.0 previa)
