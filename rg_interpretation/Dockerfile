FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
# COPY yarn.lock ./

RUN npm i

COPY . .

CMD [ "npm", "start" ]