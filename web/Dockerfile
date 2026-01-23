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
