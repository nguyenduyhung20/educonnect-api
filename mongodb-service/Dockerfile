FROM node:20.11.1-bookworm-slim AS builder

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build

FROM node:20.11.1-bookworm-slim AS production

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node package*.json ./

RUN npm install --production

USER node

CMD ["dumb-init", "node", "dist/index.js"]