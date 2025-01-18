# Stage 1: Frontend build
FROM oven/bun:canary-alpine AS build-frontend
WORKDIR /app

# Copy dependencies untuk qemmuWeb
COPY ./qemmuWeb/package.json ./qemmuWeb/bun.lockb ./
RUN bun install --frozen-lockfile

# Copy seluruh source code frontend
COPY ./qemmuWeb .

# Debug: cek file yang disalin
RUN ls -la

# Build aplikasi frontend
RUN bun run build

# Stage 2: Backend build
FROM golang:1.23.4 AS build-backend
WORKDIR /app

# Copy dependencies backend
COPY go.mod go.sum ./
RUN go mod download

# Copy seluruh source code backend
COPY . .

# Copy hasil build frontend
COPY --from=build-frontend /app/dist ./qemmuWeb/dist

# Set environment untuk build backend
ENV CGO_ENABLED=1
ENV ENV=prod
ENV DB_PATH=/app/data/webpushdb.db

# Build aplikasi backend
RUN go build -o ./bin/go .

# Stage 3: Runtime
FROM alpine:3.14
WORKDIR /app

# Install dependencies runtime
RUN apk add --no-cache gcc musl-dev libc6-compat

# Copy aplikasi backend dari tahap build
COPY --from=build-backend /app/bin/go /usr/bin/go

# Deklarasi volume dan port
VOLUME /app/data
EXPOSE 8080

# Jalankan aplikasi
CMD ["/usr/bin/go"]
