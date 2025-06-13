# Etapa de construcción - Cambiar de alpine a bullseye
FROM node:18-bullseye-slim as build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Limpiar caché npm y instalar dependencias
RUN npm cache clean --force && \
    npm ci

# Copiar todo el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 9003

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
