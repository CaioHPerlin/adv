FROM node:24-alpine

WORKDIR /app

# env
ENV CI=true
RUN corepack enable

# pnpm cache
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

# manifests
COPY package.json pnpm-lock.yaml ./

# deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# source code (separate for caching purposes)
COPY . .

EXPOSE 5173

ENTRYPOINT ["pnpm", "start:dev"]
