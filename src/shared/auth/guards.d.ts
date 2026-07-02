// Declaración de acompañamiento (no autogenerada): tipa el borde de
// guards.js sin migrarlo a TypeScript. Si cambia la firma exportada en el
// .js, actualizar este archivo en el mismo cambio.
import type { LoaderFunctionArgs } from "react-router";

export interface AuthUser {
  id: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  token: string | null;
  refreshToken: string | null;
  groups: string[];
  group: string | null;
}

export declare const requireAuth: (request?: Request) => AuthUser;

export declare const protect: (
  permission?: string,
) => (args: Pick<LoaderFunctionArgs, "request">) => null;

export declare const redirectIfAuthenticated: () => null;
