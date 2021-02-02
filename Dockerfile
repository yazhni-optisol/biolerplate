FROM node:12.18.2

RUN mkdir -p /boilerplate
WORKDIR /boilerplate
COPY . .
RUN npm i
CMD npm run start

EXPOSE 8080
