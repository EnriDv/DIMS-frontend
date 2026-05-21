# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

ARG PUBLIC_API_URL
ARG PUBLIC_APP_NAME
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_APP_NAME=$PUBLIC_APP_NAME

COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
    adduser -S astro -u 1001

COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/package.json ./package.json

USER astro

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "./dist/server/entry.mjs"]
