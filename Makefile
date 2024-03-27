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
	docker-compose -f docker-compose-kz-elk.yml up mongodb mongodb-ui mongodb-service kafka kafka-ui zookeeper -d

buildMS:
	docker-compose -f docker-compose-kz-elk.yml up mongodb mongodb-ui mongodb-service kafka kafka-ui zookeeper --build -d

upNoti:
	docker-compose -f docker-compose-kz-elk.yml up notification-service -d

buildNoti:
	docker-compose -f docker-compose-kz-elk.yml up notification-service --build -d && docker image prune -f

upKafka: 
	docker-compose -f docker-compose-kz-elk.yml up zookeeper kafka -d

