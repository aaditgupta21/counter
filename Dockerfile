FROM node:15-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i

CMD ["npm", "start"]
