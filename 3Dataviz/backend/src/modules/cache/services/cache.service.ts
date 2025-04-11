import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Client } from "memjs";

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private cache: Client;

  onModuleInit() {
    this.cache = Client.create("localhost:11211");
  }

  onModuleDestroy() {
    this.cache.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    const result = await this.cache.get(key);
    if (result.value) {
      return JSON.parse(result.value.toString()) as T;
    }
    return null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 2592000): Promise<void> {
    const stringValue = JSON.stringify(value);
    await this.cache.set(key, stringValue, { expires: ttlSeconds });
  }
}
