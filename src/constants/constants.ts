export const KAFKA_TOPIC = {
  USER_EVENTS: 'user-events'
};

export const KAFKA_CLIENT_ID = {
  USER_EVENTS_1: 'user-event-producer-1'
};

export const RECOMMEND_SERVER = {
  URL: process.env.RECOMMEND_SERVER_URL || 'localhost:8007'
};

export const MONGODB = {
  URI: process.env.MONGO_URL ?? 'mongodb://dev:password@localhost:27018',
  DB_NAME: 'educonnect',
  COLLECTION: {
    USER_EVENTS: 'user_events'
  }
};

export const REDIS = {
  URI: process.env.REDIS_URL || 'redis://localhost:6379'
};

export const ELASTICSEARCH_POST_INDEX_NAME = 'post-index';

export const KAFKA = {
  KAFKA_BROKER_URI_1: process.env.KAFKA_BROKER_URI_1 ?? 'localhost:29092',
  KAFKA_USERNAME: process.env.KAFKA_USERNAME ?? '',
  KAFKA_PASSWORD: process.env.KAFKA_PASSWORD ?? ''
};
