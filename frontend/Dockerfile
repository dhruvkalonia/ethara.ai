FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
ENV NGINX_ENVSUBST_FILTER=BACKEND_URL
ENV BACKEND_URL=https://ethara-ai-1-qq4s.onrender.com
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
