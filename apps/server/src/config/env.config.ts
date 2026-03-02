export const envConfig = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  jwtSecret: process.env.JWT_SECRET,
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017",
  mongodbDbName: process.env.MONGODB_DB_NAME || "sdn302",
};
