export const envConfig = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  jwtSecret: process.env.JWT_SECRET || "access-secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refresh-secret",
  jwtResetSecret: process.env.JWT_RESET_SECRET || "reset-secret",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  jwtResetExpiresIn: process.env.JWT_RESET_EXPIRES_IN || "15m",
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017",
  mongodbDbName: process.env.MONGODB_DB_NAME || "QuizApp",
};
