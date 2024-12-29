FROM --platform=linux/arm64 oven/bun:canary-alpine AS build-frontend
WORKDIR /build

COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

COPY package.json bun.lockb ./
RUN --mount=type=cache,id=bun-prod,target=~/.bun/install/cache \
  bun install --production --frozen-lockfile

FROM golang:1.21 as build

# Set the Current Working Directory inside the container
WORKDIR /build

# Copy the modules files
COPY go.mod .
COPY go.sum .

# Download the modules
RUN go mod download

# Copy rest fo the code
COPY . .

# Copt the frontend build into the expected folder
COPY --from=build-frontend /build/dist ./dist

RUN CGO_ENABLED=0 ENV=prod go build -buildvcs=false -o ./bin/go-vite ./main.go

FROM alpine:3.14

COPY --from=build /build/bin/go-vite /usr/bin/go-vite

# This container exposes port 3000 to the outside world
EXPOSE 3000

# Run the executable
CMD ["/usr/bin/go-vite"]