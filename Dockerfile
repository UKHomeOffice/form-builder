FROM digitalpatterns/node:latest AS build

WORKDIR /app-build

RUN mkdir -p /app-build

COPY package.json /app-build/package.json
COPY server /app-build/server
COPY client /app-build/client

RUN npm --prefix server ci &&  npm --prefix server run build-ts

RUN npm prune --production

RUN npm --prefix client ci && npm --prefix client run build


FROM digitalpatterns/node:latest

WORKDIR /app

RUN mkdir -p /app /config

COPY --from=build /app-build/client/node_modules/govuk-frontend/assets /app/client/node_modules/govuk-frontend/assets
COPY --from=build /app-build/client/build /app/client/build
COPY --from=build /app-build/server/dist /app/server/dist
COPY --from=build /app-build/server/node_modules /app/server/node_modules


RUN chown -R node:node /app /config

ENV NODE_ENV='production'

USER 1000

EXPOSE 8080

WORKDIR /app/server

ENTRYPOINT exec node dist/bootstrap.js
