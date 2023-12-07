FROM node:16-alpine

RUN apk add --no-cache bash
RUN mkdir -p /app
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

COPY . .

RUN npm install
RUN npm run build --clean

1CMD ['npm', 'run', 'start']

EXPOSE 3000
