FROM node:latest as build-stage
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install --force
ADD src /usr/src/app/src
ADD public /usr/src/app/public

RUN npm build

CMD ["npm", "start"]