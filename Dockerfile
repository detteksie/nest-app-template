ARG IMAGE=node:16-alpine

# Common
FROM ${IMAGE} as builder
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .

# Development
FROM builder as dev
CMD [""]

# Prod Middle Step
FROM builder as prod-build
RUN npm run build
RUN npm prune --omit=dev

# Prod
FROM ${IMAGE} as prod
COPY --chown=node:node --from=prod-build /app/build /app/build
COPY --chown=node:node --from=prod-build /app/migrations /app/migrations
COPY --chown=node:node --from=prod-build /app/node_modules /app/node_modules
COPY --chown=node:node --from=prod-build ["/app/package.json", "/app/package-lock.json", "/app/dataSource.js", "/app/ormconfig.js", "/app/webpack-hmr.config.js", "/app/"]
# COPY --chown=node:node --from=prod-build /app/.env /app/dist/.env

ENV NODE_ENV=production
ENV JWT_SECRET=H3ll0W0rld!
ENV THROTTLE_TTL=60
ENV THROTTLE_LIMIT=10
ENV DATABASE_URL=postgres://postgres:postgres@postgres:5432/nest-app

WORKDIR /app
USER node
CMD ["node", "."]
