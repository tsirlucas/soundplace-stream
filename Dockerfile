FROM node:10.6.0-alpine

WORKDIR app

RUN apk --no-cache add \
  sudo \
  python

RUN sudo wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl &&\
  sudo chmod a+rx /usr/local/bin/youtube-dl

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD npm start