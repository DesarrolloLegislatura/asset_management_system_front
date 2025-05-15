import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useCallback, useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";
// Schema de validación
const loginSchema = z.object({
  username: z.string().min(5, "El usuario debe tener al menos 5 caracteres"),
  password: z.string().min(5, "La contraseña debe tener al menos 5 caracteres"),
  // .regex(/[A-Z]/, "Debe contener al menos una mayúscula"),
});

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate();
  const { login, authError, isAuthenticated } = useAuth();
  const user = useAuthStore((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    clearErrors,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (isAuthenticated) {
      // Redirigir según el grupo del usuario
      const userGroup = user.group;
      console.log(!userGroup);

      if (!userGroup) {
        navigate("/unauthorized", { replace: true });
        return;
      }
      console.log(!userGroup);

      if (userGroup.includes("Administrativo")) {
        navigate("/ficha-ingreso", { replace: true });
      } else if (userGroup.includes("Tecnico")) {
        navigate("/ficha-tecnica", { replace: true });
      } else if (userGroup.includes("Admin")) {
        navigate("/", { replace: true });
      } else {
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [isAuthenticated, navigate, user]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        clearErrors();
        const { username, password } = data;
        await login(username, password);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
    [login, clearErrors]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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

      {errors.root && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md"
        >
          <CircleAlert className="w-5 h-5" />
          <span>{errors.root.message}</span>
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Usuario</Label>
          <Input
            id="username"
            type="text"
            placeholder="ohpallud"
            autoComplete="username"
            aria-invalid={!!errors.username}
            aria-describedby="username-error"
            disabled={isSubmitting}
            {...register("username")}
          />
          {errors.username && (
            <p
              id="username-error"
              className="flex items-center gap-1 mt-1 text-sm text-red-600"
            >
              <CircleAlert className="w-4 h-4" />
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
            disabled={isSubmitting}
            {...register("password")}
          />
          {errors.password && (
            <p
              id="password-error"
              className="flex items-center gap-1 mt-1 text-sm text-red-600"
            >
              <CircleAlert className="w-4 h-4" />
              {errors.password.message}
            </p>
          )}
        </div>
        {authError && (
          <>
            <p
              id="username-error"
              className="flex items-center gap-1 mt-1 text-sm text-red-600"
            >
              <CircleAlert className="w-10 h-10" />
              {authError}
            </p>
          </>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isDirty}
          aria-disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </div>
    </form>
  );
}
