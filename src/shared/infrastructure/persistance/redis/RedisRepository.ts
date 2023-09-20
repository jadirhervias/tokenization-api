import { Nullable } from "../../../domain/types";
import { RedisClientFactory, RedisConnection } from "./RedisClientFactory";

export abstract class RedisRepository {
  private _client?: RedisConnection;

  constructor() {
    this._client = RedisClientFactory.getClient();
  }

  protected abstract keyPrefix(): Nullable<string>;

  private makeKey(id: string): string {
    const prefix = this.keyPrefix();

    return prefix ? `${prefix}:${id}` : id;
  }

  protected async savePrimitive(key: string, value: unknown, ttlInSeconds: number): Promise<void> {
    this.validateRedisOpen();
    await this._client.set(this.makeKey(key), String(value), {
      EX: ttlInSeconds,
    });
  }

  protected async get(key: string): Promise<Nullable<string>> {
    this.validateRedisOpen();

    return await this._client.get(this.makeKey(key))
  }

  protected async remove(key: string): Promise<void> {
    this.validateRedisOpen();
    await this._client.unlink(this.makeKey(key));
  }

  protected async exists(key: string): Promise<boolean> {
    this.validateRedisOpen();
    const reply = await this._client.exists(this.makeKey(key));

    return reply == 1;
  }

  private validateRedisOpen() {
    if (!this._client) {
      throw new Error('Redis connection needs to be open.');
    }
  }
}