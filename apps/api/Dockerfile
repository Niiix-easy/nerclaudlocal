FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
RUN npm i -g pnpm && pnpm i --filter api

COPY . .
# A compilação precisaria da API correta. Para o container, o sistema de update executa DENTRO do container ou no host?
# O servidor ZimaOS usa Docker para hospedar a API. Então a API roda dentro do Docker.
# Se a API roda dentro do Docker, ela não consegue fazer "git pull" do host ou reiniciar o "docker-compose up".
