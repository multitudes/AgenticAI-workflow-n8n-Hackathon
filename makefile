.PHONY: all up start stop down logs clean

# Default target - start all services and follow logs
all: up logs

# Start services in detached mode
up:
    docker compose up -d --build --remove-orphans

# Start existing containers
start:
    docker compose start

# Stop containers without removing them
stop:
    docker compose stop

# Stop and remove containers, networks, volumes
down:
    docker compose down --remove-orphans

# Follow logs for all services
logs:
    docker compose logs -f

# Clean up everything including volumes
clean:
    docker compose down --remove-orphans --volumes
    docker system prune -f