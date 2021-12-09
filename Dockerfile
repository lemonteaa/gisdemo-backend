FROM node:14-slim

WORKDIR /usr/src/app

ADD package.json .
RUN npm install

COPY *.js .

EXPOSE 3000

CMD node index.js