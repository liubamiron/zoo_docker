FROM node:16-alpine as build

COPY package*.json ./
RUN npm install

COPY . .

RUN npm build

CMD [ "node", "index.js" ]