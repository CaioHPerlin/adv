FROM node:24-alpine AS base
RUN corepack enable
ENV CI=true
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

FROM base AS dev
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
# not strictly necessary since we're running dev with volumes in docker-compose
COPY . . 
EXPOSE 5000 5555
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm prisma db seed && pnpm start:dev"]

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate --schema=./src/prisma/schema.prisma
RUN pnpm build

FROM base AS prod
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

COPY --from=build /app/src/prisma /app/src/prisma
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/prisma.config.ts /app/prisma.config.ts
EXPOSE 5000
CMD ["pnpm", "start:prod"]