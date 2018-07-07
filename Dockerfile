FROM node:10.6.0-alpine

WORKDIR app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD npm start