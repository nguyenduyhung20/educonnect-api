import { MongoClient } from 'mongodb';
import { MONGODB } from '../constants/constants';

export const mongo = new MongoClient(MONGODB.URI);
