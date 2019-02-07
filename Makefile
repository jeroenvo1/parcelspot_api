# Name of the repo
REPO=jeroenvo

# Name of the image
IMAGE=parcelspot-api

# Current branch-commit (example: master-ab01c1z)
CURRENT=`echo $$TRAVIS_BRANCH | cut -d'/' -f 2-`-$$(git rev-parse HEAD | cut -c1-7)

# Colors
GREEN=\033[0;32m
NC=\033[0m

build-api:
	echo "$(GREEN)--- BUILDING DOCKER API IMAGE ---$(NC)"
	rm -rf node_modules
	docker build -t $(REPO)/$(IMAGE):$(CURRENT) .

build-docs:
	echo "$(GREEN)--- BUILDING DOCKER DOCS IMAGE ---$(NC)"
	docker build -t $(REPO)/parcelspot-api-docs:$(CURRENT) -f docs/Dockerfile .

push-api:
	echo "$(GREEN)--- PUSHING API IMAGE TO HUB ---$(NC)"
	docker push $(REPO)/$(IMAGE):$(CURRENT)

push-docs:
	echo "$(GREEN)--- PUSHING DOCS IMAGE TO HUB ---$(NC)"
	docker push $(REPO)/parcelspot-api-docs:$(CURRENT)
  
# Deploy task
deploy: deploy-api deploy-docs

deploy-api:
	echo "$(GREEN)--- DEPLOYING API TO SERVER ---$(NC)"
	node operations/scripts/deploy.js --sshPassword $$SSH_PASSWORD --sshUser $$SSH_USER --tag $(CURRENT) --dockerUsername $$DOCKER_USERNAME --dockerPassword $$DOCKER_PASSWORD --image $(IMAGE) --port 8081:8081

deploy-docs:
	echo "$(GREEN)--- DEPLOYING DOCS TO SERVER ---$(NC)"
	node operations/scripts/deploy.js --sshPassword $$SSH_PASSWORD --sshUser $$SSH_USER --tag $(CURRENT) --dockerUsername $$DOCKER_USERNAME --dockerPassword $$DOCKER_PASSWORD --image parcelspot-api-docs --port 8082:80

sonarqube:
	sonar-scanner