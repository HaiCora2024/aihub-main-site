FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY backend/contact-api/package*.json ./
RUN npm ci --omit=dev

COPY backend/contact-api/server.js ./server.js
COPY backend/contact-api/forms ./forms
COPY backend/contact-api/shop ./shop
COPY backend/contact-api/shared ./shared

EXPOSE 8080

CMD ["node", "server.js"]
