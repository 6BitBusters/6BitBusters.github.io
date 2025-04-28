import { Module } from "@nestjs/common";
import { DataVisualizationController } from "./controllers/data-visualization.controller";
import { DataVisualizationService } from "./services/data-visualization.service";
import { fetchersFactory } from "../fetchers/factories/fetchers.factory";
import { RepositoryModule } from "../repository/repository.module";
import { FetchersModule } from "../fetchers/fetchers.module";

@Module({
  imports: [RepositoryModule, FetchersModule],
  controllers: [DataVisualizationController],
  providers: [
    DataVisualizationService,
    {
      provide: "FETCHERS",
      useFactory: fetchersFactory,
    },
  ],
})
export class DataVisualizationModule {}
