# Install dependencies only when needed
FROM node:lts-alpine AS base

WORKDIR /opt/app
ADD package.json .
ADD yarn.lock .
RUN yarn install --frozen-lockfile

# 
FROM node:lts-alpine AS build
ENV NODE_ENV=production
WORKDIR /opt/app
ADD . .
COPY --from=base /opt/app/node_modules ./node_modules
RUN yarn build

# Production image for k8s deployment
FROM node:lts-alpine AS production-k8s

WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=build /opt/app/package.json .
COPY --from=build /opt/app/yarn.lock .
COPY --from=build /opt/app/.next ./.next
ADD env/.env.k8s .env.local
RUN yarn install --production --frozen-lockfile
CMD ["node_modules/.bin/next", "start"]

# Production image for docker
FROM node:lts-alpine AS production-docker

WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=build /opt/app/package.json .
COPY --from=build /opt/app/yarn.lock .
COPY --from=build /opt/app/.next ./.next
ADD env/.env.docker .env.local
RUN yarn install --production --frozen-lockfile
CMD ["node_modules/.bin/next", "start"]