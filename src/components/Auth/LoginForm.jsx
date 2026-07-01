import { cn } from "@/utils/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { CircleAlert } from "lucide-react";
import { useActionState } from "react";
import { z } from "zod";

// Schema de validación
const loginSchema = z.object({
  username: z.string().min(5, "El usuario debe tener al menos 5 caracteres"),
  password: z.string().min(5, "La contraseña debe tener al menos 5 caracteres"),
});

const initialState = { fieldErrors: {}, formError: null };

export function LoginForm({ className, ...props }) {
  const { login } = useAuth();

  // React 19 Action: gestiona pending y errores sin estado manual.
  // La validación de campos (Zod) corre dentro del Action; la redirección
  // en caso de éxito la realiza useAuth.login.
  const [state, formAction, isPending] = useActionState(async (_prev, formData) => {
    const parsed = loginSchema.safeParse({
      username: formData.get("username"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return {
        fieldErrors: parsed.error.flatten().fieldErrors,
        formError: null,
      };
    }

    try {
      await login(parsed.data.username, parsed.data.password);
      return initialState;
    } catch (error) {
      return { fieldErrors: {}, formError: error.message };
    }
  }, initialState);

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
      noValidate
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Ingresa usuario y contraseña para acceder al sistema de Fichas
          Técnicas.
        </p>
      </div>

      {state.formError && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md"
        >
          <CircleAlert className="w-5 h-5" />
          <span>{state.formError}</span>
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Usuario</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="usuario"
            autoComplete="username"
            aria-invalid={!!state.fieldErrors.username}
            aria-describedby="username-error"
            disabled={isPending}
          />
          {state.fieldErrors.username && (
            <p
              id="username-error"
              className="flex items-center gap-1 mt-1 text-sm text-red-600"
            >
              <CircleAlert className="w-4 h-4" />
              {state.fieldErrors.username[0]}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            autoComplete="current-password"
            aria-invalid={!!state.fieldErrors.password}
            aria-describedby="password-error"
            disabled={isPending}
          />
          {state.fieldErrors.password && (
            <p
              id="password-error"
              className="flex items-center gap-1 mt-1 text-sm text-red-600"
            >
              <CircleAlert className="w-4 h-4" />
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          aria-disabled={isPending}
        >
          {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </div>
    </form>
  );
}
