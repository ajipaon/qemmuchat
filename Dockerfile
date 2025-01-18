FROM --platform=$BUILDPLATFORM oven/bun:canary-alpine AS build-frontend
WORKDIR /build

COPY ./qemmuWeb/package.json ./qemmuWeb/bun.lockb .
RUN bun install --frozen-lockfile

COPY ./qemmuWeb .

RUN ls -la

RUN bun run build

FROM --platform=$BUILDPLATFORM golang:1.23.4 AS build
WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .

COPY --from=build-frontend /build/dist ./qemmuWeb/dist

RUN CGO_ENABLED=1 ENV=prod go build -buildvcs=false -o main .

RUN touch webpush.db

FROM alpine:3.14

RUN apk add --no-cache \
    gcc \
    musl-dev

WORKDIR /app
COPY --from=build /build/main .
COPY --from=build /build/webpush.db .

# Expose the application port
EXPOSE 8080

# Command to start the application
CMD ["./main"]
