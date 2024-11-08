import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

type AppConfig = {
  PORT: number;
  API_TOKEN: string;
  BOT_ID: string;
  GROUP_ID: string;
  TEST_MODE?: boolean;
};

const getRequiredEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

const appConfig: AppConfig = {
  PORT: Number(process.env.PORT) || 3000,
  API_TOKEN: getRequiredEnvVar('API_TOKEN'),
  BOT_ID: getRequiredEnvVar('BOT_ID'),
  GROUP_ID: getRequiredEnvVar('GROUP_ID'),
  TEST_MODE: process.env.TEST_MODE === 'true',
};

export { appConfig };
