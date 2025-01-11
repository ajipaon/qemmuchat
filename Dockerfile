FROM --platform=$BUILDPLATFORM oven/bun:canary-alpine AS build-frontend
WORKDIR /build

COPY ./qemmuWeb/package.json ./qemmuWeb/bun.lockb ./
RUN bun instal --frozen-lockfile

COPY ./qemmuWeb .
RUN bun run build


FROM --platform=$BUILDPLATFORM golang:1.23.4 AS build

WORKDIR /build

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

COPY --from=build-frontend /build/dist ./qemmuWeb/dist

RUN CGO_ENABLED=0 ENV=prod go build -buildvcs=false -o ./bin/go .

FROM alpine:3.14

COPY --from=build /build/bin/go /usr/bin/go

EXPOSE 8080

CMD ["/usr/bin/go"]