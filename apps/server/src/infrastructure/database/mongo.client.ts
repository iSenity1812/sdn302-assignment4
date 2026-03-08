import { envConfig } from "@/config/env.config";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

export async function createMongoClient(): Promise<MongoClient> {
  await mongoose.connect(envConfig.mongodbUri, {
    dbName: process.env.MONGODB_DB_NAME || "QuizApp",
  });

  const client = new MongoClient(
    process.env.MONGODB_URI || "mongodb://localhost:27017",
  );
  await client.connect();
  // Optionally, you can verify the connection by pinging the database
  await client
    .db(process.env.MONGODB_DB_NAME || "QuizApp")
    .command({ ping: 1 });
  console.log("Connected to MongoDB successfully");
  return client;
}
