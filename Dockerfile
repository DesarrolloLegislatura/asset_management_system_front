# Etapa de construcción
FROM node:16-alpine as build

WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia todo el código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine

# Copia los archivos construidos desde la etapa de build
# Nota: Ajusta la carpeta 'build' si tu aplicación utiliza otro nombre (como 'dist')
COPY --from=build /app/build /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Inicia nginx
CMD ["nginx", "-g", "daemon off;"]
