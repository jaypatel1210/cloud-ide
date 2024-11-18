FROM node:20.13.0 AS installer
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .


FROM alpine:3.19
RUN apk add --no-cache nodejs
RUN addgroup -S node && adduser -S node -G node
USER node
WORKDIR /app
COPY --from=installer /app .
EXPOSE 4000
CMD ["node", "./src/index.js"]
