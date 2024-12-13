#Etapa de contrucción
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#Etapa de producción (NODE)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY --from=build /app/.output ./

RUN npm install --omit=dev

EXPOSE 3000

CMD [ "node", "server/index.mjs" ]