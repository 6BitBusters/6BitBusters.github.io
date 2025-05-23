import { Module } from "@nestjs/common";
import { DataSourceController } from "./controllers/data-source.controller";
import { DataSourceService } from "./services/data-source.service";
import { fetchersFactory } from "../fetchers/factories/fetchers.factory";

@Module({
  controllers: [DataSourceController],
  providers: [
    DataSourceService,
    {
      provide: "FETCHERS",
      useFactory: fetchersFactory,
    },
  ],
})
export class DataSourceModule {}
