FROM --platform=$BUILDPLATFORM oven/bun:canary-alpine AS build-frontend
WORKDIR /app

COPY ./qemmuWeb/package.json ./qemmuWeb/bun.lockb .
RUN bun install --frozen-lockfile

COPY ./qemmuWeb .

# Debug: cecking list copy file qemmuWeb
RUN ls -la

RUN bun run build


FROM --platform=$BUILDPLATFORM golang:1.23.4 AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

COPY --from=build-frontend /app/dist ./qemmuWeb/dist


RUN go build -buildvcs=false -o app


# RUN CGO_ENABLED=1 ENV=prod ENV=/data/webpushdb.db go build -buildvcs=false -o .


FROM alpine:3.14

VOLUME data

RUN CGO_ENABLED=1 ENV=prod ENV=/data/webpushdb.db

RUN apk add gc musl-dev

# COPY --from=build /build/bin/go .
# COPY --from=build /app/bin/go /usr/bin/go

RUN ls -la

EXPOSE 8080

CMD ["/usr/bin/go"]
# CMD ["./go"]