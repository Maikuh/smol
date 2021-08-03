FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY pnpm*.yaml .

RUN wget -qO - https://get.pnpm.io/v6.7.js | node - add --global pnpm

RUN pnpm install

COPY . .

USER node

CMD ["pnpm", "dev"]
