FROM node:20.13.0 AS installer
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .

# Runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=installer /app .
EXPOSE 4070
CMD ["node", "./src/index.js"]
