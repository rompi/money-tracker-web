# Project Variables
PROJECT_NAME=money-tracker
DOCKER_IMAGE=$(PROJECT_NAME):latest
NEXT_PORT=3000

# Run the dev server locally
dev:
	npm install
	npm run dev

# Build for production (static files and Next build)
build:
	npm install
	npm run build

# Build Docker image
docker-build:
	docker build -t $(DOCKER_IMAGE) .

# Run Docker container in production mode
docker-run:
	docker run -d \
		--name $(PROJECT_NAME) \
		-p $(NEXT_PORT):3000 \
		-e NODE_ENV=production \
		$(DOCKER_IMAGE)

# Stop and remove container
docker-clean:
	docker stop $(PROJECT_NAME) || true
	docker rm $(PROJECT_NAME) || true

# Rebuild from scratch
rebuild: docker-clean docker-build docker-run
