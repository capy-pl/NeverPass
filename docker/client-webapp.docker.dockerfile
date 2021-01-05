# Install dependencies only when needed
FROM node:lts-alpine AS base

WORKDIR /opt/app
ADD package.json .
ADD yarn.lock .
RUN yarn install --frozen-lockfile

FROM node:lts-alpine AS docker-builder
ENV NODE_ENV=production
WORKDIR /opt/app
ADD . .
COPY --from=base /opt/app/node_modules ./node_modules
ADD env/.env.docker .env.local
RUN yarn build

# Production image for docker
FROM node:lts-alpine AS production-docker
WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=docker-builder /opt/app/package.json .
COPY --from=docker-builder /opt/app/yarn.lock .
COPY --from=docker-builder /opt/app/.next ./.next
ADD env/.env.docker .env.local
RUN yarn install --production --frozen-lockfile
CMD ["node_modules/.bin/next", "start"]
