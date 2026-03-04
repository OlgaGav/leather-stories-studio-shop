# ---- build client ----
FROM node:20-alpine AS client_build
WORKDIR /client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# ---- build server ----
FROM node:20-alpine AS server
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ .

# Put built React into server static folder
# Adjust if your server serves static from another folder
COPY --from=client_build /client/dist ./public

ENV NODE_ENV=production
EXPOSE 5050
CMD ["node", "server.js"]