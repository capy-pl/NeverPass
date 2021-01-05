# Install dependencies only when needed
FROM node:lts-alpine AS base

WORKDIR /opt/app
ADD package.json .
ADD yarn.lock .
RUN yarn install --frozen-lockfile

FROM node:lts-alpine AS k8s-builder
ENV NODE_ENV=production
WORKDIR /opt/app
ADD . .
ADD env/.env.k8s .env.local
COPY --from=base /opt/app/node_modules ./node_modules
RUN yarn build

# Production image for k8s deployment
FROM node:lts-alpine AS production-k8s
WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=k8s-builder /opt/app/package.json .
COPY --from=k8s-builder /opt/app/yarn.lock .
COPY --from=k8s-builder /opt/app/.next ./.next
RUN yarn install --production --frozen-lockfile
CMD ["node_modules/.bin/next", "start"]
