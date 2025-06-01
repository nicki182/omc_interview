FROM node:23-slim
# Create app directory
# Create Directory for the Container
WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package.json .
COPY ./prisma .
# Install all Packages
RUN pnpm install
# Copy all other source code to work directory
COPY . /usr/src/app

RUN pnpm bs:production