import { createClient } from 'redis';
import { Nullable } from '../../../domain/types';

export type RedisConnection = ReturnType<typeof createClient>;

export class RedisClientFactory {
  private static client: Nullable<RedisConnection> = null;

  static async createClient(connectionUri: string, databaseName: string): Promise<RedisConnection> {
    let client = RedisClientFactory.getClient();

    if (!client) {
      client = await RedisClientFactory.createAndConnectClient(connectionUri, databaseName);
      this.client = client;
    }

    return client;
  }

  static async closeConnection(): Promise<void> {
    const client = RedisClientFactory.client;
    if (client) {
      await client.disconnect();
      this.client = null;
      console.log('Redis client disconnected.');
    }
  }

  static getClient(): Nullable<RedisConnection> {
    return RedisClientFactory.client;
  }

  private static async createAndConnectClient(url: string, databaseName: string): Promise<RedisConnection> {
    try {
      const client = createClient({
        url,
        name: databaseName,
      });

      client.on('error', (error: Error) => {
        console.error('[RedisConnectionError]', error);
      })

      await client.connect();

      console.log('Redis client connected.');

      return client;
    } catch (error) {
      console.error('[RedisConnectionError]', error);
      throw new Error('Redis connection failed.');
    }
  }
}