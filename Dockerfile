FROM node:16-slim

LABEL maintainer="ghaaymen@gmail.com"
LABEL Description="Air Quality API"

ENV APP_NAME=airQuality
ENV AIRQUALITY_CONFIG_PATH=/airQuality-app/src/config/
ENV PORT=8081
ENV MONGODB_DOCKER_PORT=27018

RUN apt-get update && apt-get install -y ca-certificates --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /airQuality-app

RUN mkdir /airQuality-app/logs

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD [ "npm", "start" ]