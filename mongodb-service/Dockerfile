FROM node:20.11.1-alpine AS builder

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build

FROM node:20.11.1-alpine AS production

RUN apk add --no-cache dumb-init

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node package*.json ./

RUN npm ci --only=prod

USER node

CMD ["dumb-init", "node", "dist/index.js"]