import { envConfig } from "@/config/env.config";
import { MongoClient } from "mongodb";

export async function createMongoClient(): Promise<MongoClient> {
  const client = new MongoClient(envConfig.mongodbUri);
  await client.connect();
  return client;
}
