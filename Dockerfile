FROM node:18-alpine

WORKDIR /usr/src

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh", "-c", "npx prisma migrate dev && npm run build && npm run test && node dist/main.js"]
