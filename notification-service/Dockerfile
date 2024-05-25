FROM node:20.11.1-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

FROM node:20.11.1-alpine3.19 AS production

ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "start"]