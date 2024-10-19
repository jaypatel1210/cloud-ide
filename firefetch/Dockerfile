FROM node:20.13.1-alpine AS app
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

FROM alpine:3.19
RUN apk add --no-cache nodejs
RUN addgroup -S node && adduser -S node -G node
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY --from=app /app .
ENV NODE_ENV=production
CMD ["node", "index.js"]
