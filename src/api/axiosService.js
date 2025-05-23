import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const API_URL_DEV = import.meta.env.VITE_API_URL_DEV;
// const API_URL_PROD = import.meta.env.VITE_API_URL_PROD;

const axiosService = axios.create({
  baseURL: API_URL_DEV,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Acceder al store directamente (sin usar el hook)
axiosService.interceptors.request.use(
  (config) => {
    // Rutas que no requieren token (para login/registro)
    const publicRoutes = [
      "/auth/login",
      "/auth/register",
      "/users/login",
      "/users/logout",
      "/tds/tds",
      "/tds/assets",
      "/tds/status/",
    ];
    const isPublicRoute = publicRoutes.some((route) =>
      config.url.includes(route)
    );

    if (!isPublicRoute) {
      // Acceder al store sin usar el hook
      const token = useAuthStore.getState().user.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token enviado:");
      } else {
        console.log("No hay token disponible");
      }
    }
    return config;
  },
  (error) => {
    console.error("Error en la solicitud:", error);
    return Promise.reject(error);
  }
);

export default axiosService;
