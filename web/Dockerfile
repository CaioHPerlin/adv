FROM node:24-alpine AS base
RUN corepack enable
ENV CI=true
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# IMPORTANT: meant to be used with docker compose for development! This image relies on
# bind mounts to provide live code reloading.
FROM base AS dev
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
EXPOSE 5173
ENTRYPOINT ["pnpm", "start:dev"]

FROM base AS build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]