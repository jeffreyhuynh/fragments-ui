# dependencies
FROM node:16.15.1@sha256:a1f665affa21f2b46e476e0cb77d92b83e3713355bd28d026c257b16353c6d90 as dependencies

LABEL maintainer="Jeffrey Huynh <jhuynh34@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NODE_ENV=production
ENV NPM_CONFIG_COLOR=false

WORKDIR /build

COPY package*.json .

RUN npm ci --only=production

# build
FROM node:16.15.1@sha256:a1f665affa21f2b46e476e0cb77d92b83e3713355bd28d026c257b16353c6d90 as build

WORKDIR /build

COPY --from=dependencies /build /build

COPY . .

RUN npx parcel build index.html --public-url ./

# deployment
FROM nginx:1.23.0-alpine@sha256:20a1077e25510e824d6f9ce7af07aa02d86536848ddab3e4ef7d1804608d8125

COPY --from=build /build/dist /usr/share/nginx/html
COPY .env /usr/share/nginx/html

EXPOSE 80
