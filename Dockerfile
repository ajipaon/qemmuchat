# Build the frontend
FROM --platform=$BUILDPLATFORM oven/bun:canary-alpine AS build-frontend
WORKDIR /app

# Copy the package.json and bun.lockb files to the working directory
COPY ./qemmuWeb/package.json ./qemmuWeb/bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the entire qemmuWeb directory to the working directory
COPY ./qemmuWeb .

# Debug: check the list of copied files in qemmuWeb
RUN ls -la

# Build the frontend
RUN bun run build

# Build the backend
FROM --platform=$BUILDPLATFORM golang:1.23.4 AS build
WORKDIR /app

# Copy go.mod and go.sum to the working directory
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire project to the working directory
COPY . .

# Copy the built frontend from the build-frontend stage
COPY --from=build-frontend /app/dist ./qemmuWeb/dist

# Build the Go application
RUN go build -buildvcs=false -o app

# Create the final image
FROM alpine:3.14

# Define volumes
VOLUME /data

# Set environment variables
ENV CGO_ENABLED=1
ENV ENV=prod
ENV DATABASE_PATH=/data/webpushdb.db

# Install required packages
RUN apk add --no-cache gcc musl-dev

# Copy the built Go application from the build stage
COPY --from=build /app/app /usr/bin/

# Debug: check the list of files in /usr/bin
RUN ls -la /usr/bin

# Define the port the application will listen on
EXPOSE 8080

# Define the entry point for the container
CMD ["/usr/bin/app"]