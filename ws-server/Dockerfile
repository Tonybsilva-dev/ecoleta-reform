# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

# Copy only the minimal files needed for the ws server
COPY package.json package-lock.json ./
COPY scripts/ws-local.ts ./scripts/ws-local.ts

# Install runtime deps (ws and ts-node)
RUN npm i --omit=dev && npm i -D ts-node

EXPOSE 4001

CMD ["node", "-r", "ts-node/register/transpile-only", "scripts/ws-local.ts"]


