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

COPY go.mod go.sum ./

RUN go mod download

COPY . .

COPY --from=build-frontend /build/dist ./qemmuWeb/dist

VOLUME data

RUN CGO_ENABLED=1 ENV=prod ENV=/data/webpushdb.db go build -buildvcs=false -o ./bin/go .
# RUN CGO_ENABLED=1 ENV=prod ENV=/data/webpushdb.db go build -buildvcs=false -o .


FROM alpine:3.14

RUN apk add --no-cache \
    # Important: required for go-sqlite3
    gcc \
    # Required for Alpine
    musl-dev

COPY --from=build /build/bin/go .
# COPY --from=build /build/bin/go /usr/bin/go

EXPOSE 8080

CMD ["."]