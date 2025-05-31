import { createClient, RedisClientType } from "redis";
class RedisClient {
  //TODO: Check client type of redis
  private client: any;
  getClient() {
    return this.client;
  }
  public async start(): Promise<void> {
    try {
      const client = createClient({ url: process.env.REDIS_URL });
      await client.connect();
      this.client = client;
    } catch (e) {
      throw new Error(e as string);
    }
  }
  public async stop(): Promise<void> {
    await this.client.quit();
  }
}
export default new RedisClient();