import { RedisClientFactory } from '../../src/shared/infrastructure/persistance/redis/RedisClientFactory';
import { TypeOrmDataSourceFactory } from '../../src/shared/infrastructure/persistance/typeorm/TypeOrmDataSourceFactory';
import { Server } from '../backend/api/Server';

export class TokenizationApp {
  server?: Server;

  static get CONTEXT(): string {
    return 'TOKENIZATION_APP';
  }

  static get DATABASE_NAME(): string {
    return process.env.DATABASE_NAME as string;
  }

  async bootstrap() {
    const port = process.env.PORT || '3000'
    this.server = new Server(port);
    await this.startDatabaseConnection();
    await this.startRedisConnection();
  }

  async start() {
    await this.bootstrap();
    const server = this.server;

    if (!server) {
      throw new Error('Server not bootstrapped.');
    }

    return server.listen();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }

  async stop() {
    await this.server?.stop();
    await TokenizationApp.closeDatabaseConnection();
    await TokenizationApp.closeRedisConnection();
    return;
  }

  async startDatabaseConnection() {
    const dbHost = process.env.DATABASE_HOST;

    if (!dbHost) {
      throw new Error('DB host is missing.');
    }

    await TypeOrmDataSourceFactory.createDataSource(
      dbHost,
      TokenizationApp.DATABASE_NAME
    );
  }

  static async closeDatabaseConnection() {
    await TypeOrmDataSourceFactory.closeConnection();
  }

  async startRedisConnection() {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error('Redis URL is missing.');
    }

    await RedisClientFactory.createClient(
      redisUrl,
      'card_tokenizer_db'
    );
  }

  static async closeRedisConnection() {
    await RedisClientFactory.closeConnection();
  }
}