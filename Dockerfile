FROM node:20-alpine
# Install OpenSSL and other necessary packages
RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*
# Create app directory
# Create Directory for the Container
WORKDIR /usr/src/app
# Only copy the package.json file to work directory
COPY package.json .
COPY ./prisma .
COPY .env.production .env
# Install corepack and pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
# Install all Packages
RUN pnpm install


# Copy all other source code to work directory
COPY . /usr/src/app

RUN pnpm bs:production