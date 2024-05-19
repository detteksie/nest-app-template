# syntax = docker/dockerfile:1

ARG IMAGE=node:20-alpine

# Common
FROM ${IMAGE} AS base
WORKDIR /app
RUN npm install -g pm2

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

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
EXPOSE 9229

# Install All
FROM base AS installall
RUN mkdir -p /tmp/dev
COPY --link package.json pnpm-lock.yaml /tmp/dev/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store cd /tmp/dev && pnpm install --frozen-lockfile

# Development
FROM base AS dev
COPY --from=installall /tmp/dev/node_modules node_modules
COPY --link . .

# Build
FROM dev AS build
RUN pnpm run build

# Install
FROM base AS install
RUN mkdir -p /tmp/prod
COPY --link package.json pnpm-lock.yaml /tmp/prod/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store cd /tmp/prod && pnpm install --frozen-lockfile --prod

# Production
FROM base AS prod
COPY --chown=node:node --from=install /tmp/prod/node_modules node_modules
COPY --chown=node:node --from=install /tmp/prod/package.json /tmp/prod/pnpm-lock.yaml ./
COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/migrations migrations
COPY --chown=node:node --from=build /app/seeds seeds
COPY --chown=node:node --from=build /app/upload upload
COPY --chown=node:node --from=build /app/dataSource.js /app/ormconfig.js /app/ecosystem.config.js ./

ENV NODE_ENV="production"
USER node
CMD [ "pnpm", "run", "start:pm2" ]
