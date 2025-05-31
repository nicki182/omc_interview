import {CustomError} from "@error/index";
import { createClient, RedisClientType } from "redis";
class RedisClient {
  private client!: RedisClientType;
  getClient() {
    return this.client;
  }
  public async start(): Promise<void> {
    try {
      const client: RedisClientType = createClient({
        url: process.env.REDIS_URL,
      });
      await client.connect();
      this.client = client;
    } catch (e) {
      throw new CustomError(e as string);
    }
  }
  public async stop(): Promise<void> {
    await this.client.quit();
  }
}
export default new RedisClient();
