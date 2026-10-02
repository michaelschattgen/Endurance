# Vite bakes VITE_API_BASEURL into the bundle at build time. It defaults to the
# relative /api path that nginx proxies to the backend (see nginx.conf), which keeps
# the resulting image independent of the domain it is eventually served from.
FROM node:24-alpine AS build
WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASEURL=/api
ENV VITE_API_BASEURL=$VITE_API_BASEURL
RUN npm run build

FROM nginx:alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html

EXPOSE 80

# 127.0.0.1 rather than localhost: nginx listens on IPv4 only, and busybox wget tries
# localhost's ::1 first without falling back.
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD wget -q --spider http://127.0.0.1/ || exit 1
