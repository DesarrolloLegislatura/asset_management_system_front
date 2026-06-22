# Etapa de construcción - Cambiar de alpine a bullseye
FROM node:22-bookworm-slim as build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Instalar pnpm y las dependencias
RUN npm install -g pnpm@11 && \
    pnpm install --frozen-lockfile --fetch-retries=5 --fetch-timeout=300000

# Copiar todo el código fuente
COPY . .

# Construir la aplicación para producción
RUN pnpm run build

# Etapa de producción
FROM nginx:stable-alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE ${VITE_PORT}

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
