import { Module } from "@nestjs/common";
import { DataVisualizationController } from "./controllers/data-visualization.controller";
import { DataVisualizationService } from "./services/data-visualization.service";
import { ConfigService } from "@nestjs/config";
import { CacheService } from "../cache/services/cache.service";
import { fetchersFactory } from "../fetchers/factories/fetchers.factory";

@Module({
  controllers: [DataVisualizationController],
  providers: [
    DataVisualizationService,
    CacheService,
    {
      provide: "FETCHERS",
      useFactory: fetchersFactory,
    },
    ConfigService,
  ],
})
export class DataVisualizationModule {}
