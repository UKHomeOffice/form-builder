FROM node:lts-alpine as build

WORKDIR /app-build

COPY package.json /app-build/package.json
COPY server /app-build/server
COPY client /app-build/client

RUN set -eux ; \
  apk update ; \
  apk add --no-cache \
  py2-pip \
  bash \
  libc6-compat \
  gcompat \
  libgcc \
  libstdc++6 \
  libstdc++ \
  build-base \
  libtool \
  autoconf \
  automake \
  libexecinfo-dev \
  git \
  python; \
  rm -rf /var/cache/apk/* ; \
  mkdir -p /app-build ; \
  npm --prefix server ci &&  npm --prefix server run build-ts ; \
  npm prune --production ; \
  npm --prefix client ci && npm --prefix client run build

FROM node:lts-alpine as form-builder
ENV NODE_ENV='production'

COPY --from=build /app-build/client/node_modules/govuk-frontend/govuk/assets /app/client/node_modules/govuk-frontend/govuk/assets
COPY --from=build /app-build/client/build /app/client/build
COPY --from=build /app-build/server/dist /app/server/dist
COPY --from=build /app-build/server/node_modules /app/server/node_modules

RUN mkdir -p /app /config ;\ 
  chown -R node:node /app /config

USER 1000
EXPOSE 8080
WORKDIR /app/server
ENTRYPOINT exec node dist/bootstrap.js
