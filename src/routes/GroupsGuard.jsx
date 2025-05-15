import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";

export const GroupsGuard = ({ children, allowedGroups = [] }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user); // Acceder directamente al usuario del store
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Verificación de autenticación
    if (!user?.token) {
      console.log("Usuario no autenticado, redirigiendo a login");
      navigate("/auth/login", { replace: true });
      return;
    }

    // Verificación de permisos de grupo
    // Intentar acceder primero a user.groups (plural) y luego a user.group (singular) para mayor compatibilidad
    const userGroups = user.groups || user.group || [];

    // Normalizar los grupos a un array si no lo es
    const normalizedUserGroups = Array.isArray(userGroups)
      ? userGroups
      : [userGroups];

    // Verificar si hay al menos un grupo permitido
    const hasPermission =
      allowedGroups.length === 0 ||
      allowedGroups.some((group) => normalizedUserGroups.includes(group));

    console.log("Grupos del usuario:", normalizedUserGroups);
    console.log("Grupos permitidos:", allowedGroups);
    console.log("¿Tiene permiso?:", hasPermission);

    if (!hasPermission) {
      console.log(
        "Usuario sin permisos suficientes, redirigiendo a unauthorized"
      );
      navigate("/unauthorized", { replace: true });
      return;
    }

    // Si llegamos aquí, el usuario tiene los permisos necesarios
    setHasAccess(true);
  }, [user, navigate, allowedGroups]);

  // Solo renderizar si el usuario tiene token Y los permisos necesarios
  return hasAccess ? children : null;
};
