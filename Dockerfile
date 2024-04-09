FROM node:20.12.1-bookworm AS builder

WORKDIR /app 

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node src ./src
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node tsconfig.json ./

RUN npm run build

FROM node:20.12.1-bookworm AS production

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

ENV NODE_ENV production

WORKDIR /app

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node package*.json ./

RUN npm ci --only=prod

USER node

CMD ["dumb-init", "node", "dist/index.js"]