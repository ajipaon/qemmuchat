FROM --platform=$BUILDPLATFORM oven/bun:canary-alpine AS build-frontend
WORKDIR /build

COPY ./qemmuWeb/package.json ./qemmuWeb/bun.lockb .
RUN bun install --frozen-lockfile

COPY ./qemmuWeb .

# Debug: cecking list copy file qemmuWeb
RUN ls -la

RUN bun run build


FROM --platform=$BUILDPLATFORM golang:1.23.4 AS build

WORKDIR /build

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

COPY --from=build-frontend /build/dist ./qemmuWeb/dist

RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 ENV=prod go build -buildvcs=false -o ./bin/go .

FROM debian:bullseye-slim

RUN apt-get update && \
    apt-get install -y \
    golang \
    sqlite3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /build/bin/go /usr/bin/go

EXPOSE 8080

CMD ["/usr/bin/go"]