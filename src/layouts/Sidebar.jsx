import { Link } from "react-router";
import { useLocation } from "react-router";
import { usePermission } from "@/hooks/usePermission";
import { getFilteredNavigation } from "@/utils/navigation";

export function Sidebar() {
  const location = useLocation();
  const { permissions } = usePermission();

  // Obtener navegación filtrada basada en permisos
  const navigationItems = getFilteredNavigation(permissions);

  // Helper to check if route is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const renderNavItem = (item) => {
    const IconComponent = item.icon;

    return (
      <div key={item.href}>
        <Link
          to={item.href}
          className={`flex items-center px-3 py-2 rounded-md text-sm ${
            isActive(item.href)
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <IconComponent className="mr-2 h-4 w-4" />
          {item.title}
        </Link>

        {/* Renderizar sub-items si existen */}
        {item.children && item.children.length > 0 && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                to={child.href}
                className={`flex items-center px-3 py-1 rounded-md text-xs ${
                  isActive(child.href)
                    ? "bg-primary/5 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">{navigationItems.map(renderNavItem)}</div>
    </div>
  );
}
