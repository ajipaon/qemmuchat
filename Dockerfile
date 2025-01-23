
FROM oven/bun:canary-alpine AS build-frontend
WORKDIR /app

COPY ./qemmuWeb/package.json ./qemmuWeb/bun.lockb .
RUN bun install --frozen-lockfile

COPY ./qemmuWeb .

RUN ls -la

RUN bun run build

FROM golang:1.23.4 AS build-backend
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

COPY --from=build-frontend /app/dist ./qemmuWeb/dist

ENV CGO_ENABLED=1
ENV ENV=prod
ENV DB_PATH=/app/data/webpushdb.db

RUN go build -o ./bin/go .

FROM debian:bookworm-slim
WORKDIR /app

# RUN apk add --no-cache gcc musl-dev libc6-compat

RUN apt-get update && apt-get install -y --no-install-recommends \
    libc6 libgcc-s1 libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build-backend /app/bin/go /usr/bin/go

VOLUME /app/data
EXPOSE 8080

CMD ["/usr/bin/go"]
