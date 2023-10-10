FROM node:latest

RUN apt-get update && \
	apt-get install -y python3 libsodium-dev && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
# COPY yarn.lock ./

RUN npm i

COPY . .

CMD [ "npm", "start" ]