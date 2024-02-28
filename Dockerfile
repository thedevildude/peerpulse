FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g typescript

RUN npx tsc

COPY . .

EXPOSE 5000

CMD ["npm", "start"]