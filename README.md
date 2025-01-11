# QemmuChat

<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/9584/9584876.png" alt="Logo" width="150" height="150">
</p>

<p align="center">
  <strong>QemmuChat</strong><br>
  A small self-hosted chat application.
</p>

<p align="center">
  <strong style="color:red;">🚧 This repo is under development 🚧</strong>
</p>

---

## Features

- **End-to-End Encrypted (E2EE) Chat**: Secure one-on-one communication.
- **Group Chat with E2EE Encryption**: Safe and private group discussions.
- **Multiple Online Meetings**: Collaborate with your team using built-in meeting tools.

---

## Getting Started

Follow these steps to set up and run QemmuChat on your system.

### Prerequisites

- **Docker**: Ensure Docker is installed on your system.
- **Docker Compose**: Required to run the services together.

### Installation

Below is an example `docker-compose.yaml` to deploy QemmuChat:

```yaml
networks:
  qemmu_network:
    driver: bridge

services:
  app:
    image: ajipaon/qemmuchat:latest
    container_name: qemmu_chat_app
    environment:
      - ENV=prod
      - POSTGRES_HOST=qemmu_chat_postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASS=secretPassword
      - POSTGRES_PORT=5432
      - POSTGRES_DB=qemmu_chat
      - POSTGRES_TIME=Asia/Jakarta
      - SECRET=authSecret
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - qemmu_network
    restart: always

  postgres:
    image: postgres:latest
    container_name: qemmu_chat_postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secretPassword
      - POSTGRES_DB=qemmu_chat
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - qemmu_network
    restart: always

volumes:
  postgres_data:
```