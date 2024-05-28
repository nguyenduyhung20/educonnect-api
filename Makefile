ES_HOST ?= localhost
ES_PORT ?= 9200
LS_PORT ?= 9600
RETRY_INTERVAL ?= 3

setupAll: setupDB setupRedis setupELK

downAll: downDB downRedis downELK

downDB:
	docker compose down -v
downRedis:
	docker compose -f docker-compose-redis.yml down -v
downELK:
	docker compose -f docker-compose-kz-elk.yml down -v


setupDB: docker-compose.yml
	docker compose up -d 

setupRedis: docker-compose-redis.yml
	docker compose -f docker-compose-redis.yml up -d

setupELK: docker-compose-kz-elk.yml
	docker compose -f docker-compose-kz-elk.yml up -d

removeELKData: 
	rm -rf elk-data
checkE:
	@echo "Checking Elasticseach health..."
	@while ! curl -s -f http://${ES_HOST}:${ES_PORT}/_cluster/health >/dev/null; do \
		echo "Elasticsearch is not healthy. Retry in ${RETRY_INTERVAL} seconds..."; \
		sleep ${RETRY_INTERVAL}; \
	done
	@echo "Elasticsearch is healthy."
checkL:
	@echo "Checking Logstash health..."
	@while ! curl -s -f http://${ES_HOST}:${ES_PORT} >/dev/null; do \
		echo "Logstash is not healthy. Retry in ${RETRY_INTERVAL} seconds..."; \
		sleep ${RETRY_INTERVAL}; \
	done
	@echo "Logstash is healthy."
loadE:
	npm run sync-db
resetELK: downELK removeELKData setupELK checkE checkL

upNoti:
	docker compose -f docker-compose-kz-elk.yml up notification-service -d
buildNoti:
	docker compose -f docker-compose-kz-elk.yml up notification-service --build -d && docker image prune -f

buildApi:
	docker compose -f docker-compose-api.yml up --build -d && docker image prune -f 
downApi:
	docker compose -f docker-compose-api.yml down -v

# Kafka commands
upKafka: 
	docker compose -f docker-compose-kz-elk.yml up zookeeper kafka -d
buildKafka:
	docker compose -f docker-compose-kz-elk.yml up zookeeper kafka --build -d && docker image prune -f
downKafka:
	docker compose -f docker-compose-kz-elk.yml down zookeeper kafka -v
resetKafka: downKafka buildKafka

buildMS:
	docker compose -f docker-compose-kz-elk.yml up mongodb mongodb-ui zookeeper kafka kafka-ui mongodb-service --build -d && docker image prune -f
upMongo:
	docker compose -f docker-compose-kz-elk.yml up mongodb mongodb-service -d
upMS: upKafka upMongo

# Dev
upDev: 
	docker compose -f docker-compose-kz-elk.yml up zookeeper kafka elasticsearch logstash kibana -d
downDev: 
	docker compose -f docker-compose-kz-elk.yml down zookeeper kafka elasticsearch logstash kibana -v
resetDev: downDev removeELKData upDev checkE checkL


# Deploy
buildProd:
	scp -r dist/ package.json package-lock.json prisma/ debian@143.198.220.8:/home/debian/educonnect-api/


downES: 
	docker compose -f docker-compose-es.yml down -v && rm -rf elk-data && mkdir elk-data
deployES:
	docker compose -f docker-compose-es.yml up -d
downESKafka:
	docker compose -f docker-compose-es.yml down zookeeper kafka -v
setupES: deployES checkE checkL loadE
