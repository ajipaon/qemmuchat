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
ENV CGO_ENABLED=0
ENV ENV=prod
ENV DB_PATH=/app/data/webpushdb.db

# Build aplikasi backend
RUN go build -o ./bin/go .

# Stage 3: Runtime
FROM alpine:3.14
WORKDIR /app

RUN apk add --no-cache gcc musl-dev libc6-compat \
    && wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub \
    && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.34-r0/glibc-2.34-r0.apk \
    && apk add glibc-2.34-r0.apk \
    && rm -f glibc-2.34-r0.apk

# Install dependencies runtime
# RUN apk add --no-cache gcc musl-dev libc6-compat

# Copy aplikasi backend dari tahap build
COPY --from=build-backend /app/bin/go /usr/bin/go

# Deklarasi volume dan port
VOLUME /app/data
EXPOSE 8080

# Jalankan aplikasi
CMD ["/usr/bin/go"]
