FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY backend/contact-api/package*.json ./
RUN npm ci --omit=dev

COPY backend/contact-api/server.js ./server.js

EXPOSE 8080

CMD ["node", "server.js"]
