import { envConfig } from "@/config/env.config";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

export async function createMongoClient(): Promise<MongoClient> {
  await mongoose.connect(envConfig.mongodbUri, {
    dbName: envConfig.mongodbDbName,
  });

  const client = new MongoClient(envConfig.mongodbUri);
  await client.connect();
  // Optionally, you can verify the connection by pinging the database
  await client.db(envConfig.mongodbDbName).command({ ping: 1 });
  console.log("Connected to MongoDB successfully");
  return client;
}
