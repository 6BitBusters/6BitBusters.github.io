import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Client } from "memjs";
import { IRepository } from "src/interfaces/repository.interface";

@Injectable()
export class CacheRepository
  implements IRepository, OnModuleInit, OnModuleDestroy
{
  private cache: Client;
  private readonly logger = new Logger(CacheRepository.name);

  onModuleInit() {
    this.cache = Client.create("localhost:11211");
  }

  onModuleDestroy() {
    this.cache.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.cache.get(key);
      if (result.value) {
        return JSON.parse(result.value.toString()) as T;
      }
    } catch {
      return null;
    }
    return null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 2592000): Promise<void> {
    const stringValue = JSON.stringify(value);
    try {
      await this.cache.set(key, stringValue, { expires: ttlSeconds });
    } catch (error) {
      this.logger.error("Errrore durante il salvataggio in cache", error);
      // Il fallimento del salvataggio in cache non deve interrompere il flusso
    }
  }
}
