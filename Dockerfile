FROM mcr.microsoft.com/cbl-mariner/base/nodejs:18.18-cm2.0 as base

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install
RUN npx prisma generate

EXPOSE 5000

FROM base as development

ENV NODE_ENV=development

CMD ["npm", "run", "serve"]

FROM base as production

ENV NODE_ENV=production
RUN npm install -g pm2

CMD ["npm", "run", "start"]