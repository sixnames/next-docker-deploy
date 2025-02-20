# Include the .env file
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

up:
	docker-compose up --build -d

stop:
	docker compose -f docker-compose.yml stop

down:
	docker compose -f docker-compose.yml down

