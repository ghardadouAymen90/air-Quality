FROM node:16-slim

LABEL maintainer="ghaaymen@gmail.com"
LABEL Description="Air Quality API"

ENV APP_NAME=airQuality
ENV AIRQUALITY_CONFIG_PATH=/usr/src/app/src/config/
ENV PORT=8081
ENV MONGODB_DOCKER_PORT=27018

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD [ "npm", "start" ]