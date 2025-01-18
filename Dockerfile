# Stage 1: Frontend build
FROM --platform=$BUILDPLATFORM oven/bun:canary-alpine AS build-frontend
WORKDIR /app

COPY ./qemmuWeb/package.json ./qemmuWeb/bun.lockb .
RUN bun install --frozen-lockfile

COPY ./qemmuWeb .

# Debug: checking list of copied files in qemmuWeb
RUN ls -la

RUN bun run build

# Stage 2: Backend build
FROM --platform=$BUILDPLATFORM golang:1.23.4 AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

COPY --from=build-frontend /app/dist ./qemmuWeb/dist

# Ensure SQLite library is available
RUN apk add --no-cache sqlite-dev

VOLUME /data

# Set environment variables and build the Go application with SQLite support
ENV CGO_ENABLED=1
ENV ENV=prod
ENV DB_PATH=/data/webpushdb.db

RUN go build -o ./bin/go .

# Stage 3: Final image
FROM alpine:3.14

# Install necessary libraries
RUN apk add --no-cache gc musl-dev

COPY --from=build /app/bin/go /usr/bin/go

# Create a volume for the SQLite database
VOLUME /data

EXPOSE 8080

CMD ["/usr/bin/go"]