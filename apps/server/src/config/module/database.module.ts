import { Container } from "inversify";
import { createMongoClient } from "../../infrastructure/database/mongo.client";
import { DATABASE_TYPES } from "../../infrastructure/database/database.type";

export async function registerDatabase(container: Container) {
  const client = await createMongoClient();
  container.bind(DATABASE_TYPES.MongoClient).toConstantValue(client);
}
