FROM node:20.11.1-bullseye-slim
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node . /usr/src/app    
RUN npm ci
USER node
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
RUN npm run build
CMD ["dumb-init", "node", "dist/index.js"]