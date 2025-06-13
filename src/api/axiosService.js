import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { isTokenExpired } from "@/utils/jwt";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const axiosService = axios.create({
  baseURL: VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Acceder al store directamente (sin usar el hook)
axiosService.interceptors.request.use(
  async (config) => {
    // Rutas que no requieren token (para login/registro)
    const publicRoutes = ["/auth/login", "/auth/register"];
    const isPublicRoute = publicRoutes.some((route) =>
      config.url.includes(route)
    );

    if (!isPublicRoute) {
      const { token, refreshToken } = useAuthStore.getState().user;

      // Si no hay token, no podemos autenticar
      if (!token) return config;

      // Si el token está expirado y tenemos refresh, intentar refrescar antes de enviar la petición
      if (isTokenExpired(token) && refreshToken) {
        try {
          const { access, refresh } = await axios
            .post(`${VITE_API_URL}/auth/token/refresh/`, {
              refresh: refreshToken,
            })
            .then((r) => r.data);

          // Actualizar store con los nuevos tokens
          useAuthStore
            .getState()
            .setUser({ token: access, refreshToken: refresh });
          config.headers.Authorization = `Bearer ${access}`;
        } catch (error) {
          // Si falla, limpiar auth para obligar a re-login
          console.error("Error refrescando token", error);
          useAuthStore.getState().clearAuth();
          return config;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("Error en la solicitud:", error);
    return Promise.reject(error);
  }
);

// Respuesta: capturar 401 para intentar refresh automáticamente
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si no es 401 o ya intentamos refrescar, rechazar
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Marcar que vamos a reintentar
    originalRequest._retry = true;

    const { refreshToken } = useAuthStore.getState().user;
    if (!refreshToken) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    // Si ya hay un refresh en curso, encolar
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosService(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;
    try {
      const { access, refresh } = await axios
        .post(`${VITE_API_URL}/auth/token/refresh/`, { refresh: refreshToken })
        .then((r) => r.data);

      useAuthStore.getState().setUser({ token: access, refreshToken: refresh });
      processQueue(null, access);

      originalRequest.headers.Authorization = `Bearer ${access}`;
      return axiosService(originalRequest);
    } catch (err) {
      processQueue(err, null);
      useAuthStore.getState().clearAuth();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosService;
