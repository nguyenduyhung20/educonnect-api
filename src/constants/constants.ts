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
