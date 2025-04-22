import { Module } from "@nestjs/common";
import { CacheRepository } from "./repository/cache.repository";

@Module({
  providers: [
    {
      provide: "CACHE_REPOSITORY",
      useClass: CacheRepository,
    },
  ],
  exports: ["CACHE_REPOSITORY"],
})
export class CacheModule {}
