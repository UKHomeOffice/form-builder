FROM digitalpatterns/node:latest

WORKDIR /app

RUN mkdir -p /app /config


ADD . /app/

RUN npm ci && npm run build

RUN chown -R node:node /app /config

ENV NODE_ENV='production'

USER 1000

EXPOSE 8080

ENTRYPOINT exec node server.js

