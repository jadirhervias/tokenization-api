import { TokenizationApp } from "../../../apps/backend/TokenizationApp";

let app: TokenizationApp;

beforeAll(async () => {
  process.env.DATABASE_HOST = 'localhost';
  process.env.DATABASE_NAME = 'postgres';
  process.env.REDIS_URL = 'redis://localhost:6379'
  process.env.PORT = '4000';
  process.env.ENCRYPTION_KEY = 'test123';

  app = new TokenizationApp();
  await app.start();
});

afterAll(async () => {
  await app.stop();
});

export { app };