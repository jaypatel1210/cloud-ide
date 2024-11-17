# FROM node:20.13.0 AS installer
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci
# COPY . .


# FROM alpine:3.19
# RUN apk add --no-cache nodejs
# RUN addgroup -S node && adduser -S node -G node
# USER node
# WORKDIR /app
# COPY --from=installer /app .
# EXPOSE 5050
# CMD ["node", "./src/index.js"]

# Above Approch node-pty terminal is not working because of missing dependencies in alpine image
# TODO: Optimize Docker image size


FROM node:20.13.0
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5050
CMD ["node", "./src/index.js"]