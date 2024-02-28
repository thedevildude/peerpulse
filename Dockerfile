FROM node:alpine

WORKDIR /app

ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./

RUN npm install

RUN npm install -g typescript

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]