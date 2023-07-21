FROM node:17

WORKDIR /home/node/app

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run tsc
