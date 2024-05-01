# syntax = docker/dockerfile:1

ARG IMAGE=node:20-alpine

# Common
FROM ${IMAGE} AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY --link package.json pnpm-lock.yaml ./

# Development
FROM base AS dev
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --link . .
CMD [""]

# Production Dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

# Build
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --link . .
RUN pnpm run build

# Production
FROM base AS prod
COPY --chown=node:node --from=prod-deps /app/package.json /app/pnpm-lock.yaml /app/
COPY --chown=node:node --from=prod-deps /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/dataSource.js /app/ormconfig.js /app/ecosystem.config.js /app/
COPY --chown=node:node --from=build /app/dist /app/dist
COPY --chown=node:node --from=build /app/migrations /app/migrations

ENV NODE_ENV="production"
ENV DATABASE_URL="postgres://postgres:postgres@postgres:5432/nest-app-template"
ENV MONGODB_URI="mongodb://mongodb:27017/nest-app-template"
ENV REDIS_HOST="redis"
ENV REDIS_PASSWORD="redish"
ENV JWT_ACCESS_SECRET="N0t5oSecret"
ENV JWT_REFRESH_SECRET="N0t5oFre5h"
ENV THROTTLE_TTL="60"
ENV THROTTLE_LIMIT="10"
ENV MULTER_DEST="./upload"

EXPOSE 4000
USER node
CMD [ "pnpm", "run", "start:pm2" ]
