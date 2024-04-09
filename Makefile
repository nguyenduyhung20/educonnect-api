setupAll: setupDB setupRedis setupELK

downAll: downDB downRedis downELK

downDB:
	docker-compose down -v
downRedis:
	docker-compose -f docker-compose-redis.yml down -v
downELK:
	docker-compose -f docker-compose-kz-elk.yml down -v


setupDB: docker-compose.yml
	docker-compose up -d 

setupRedis: docker-compose-redis.yml
	docker-compose -f docker-compose-redis.yml up -d

setupELK: docker-compose-kz-elk.yml
	docker-compose -f docker-compose-kz-elk.yml up -d

upMS:
	docker-compose -f docker-compose-kz-elk.yml up mongodb mongodb-ui zookeeper kafka kafka-ui mongodb-service  -d

buildMS:
	docker-compose -f docker-compose-kz-elk.yml up mongodb mongodb-ui zookeeper kafka kafka-ui mongodb-service --build -d && docker image prune -f

upNoti:
	docker-compose -f docker-compose-kz-elk.yml up notification-service -d

buildNoti:
	docker-compose -f docker-compose-kz-elk.yml up notification-service --build -d && docker image prune -f

upKafka: 
	docker-compose -f docker-compose-kz-elk.yml up zookeeper kafka -d

buildApi:
	docker-compose -f docker-compose-api.yml up --build -d && docker image prune -f 