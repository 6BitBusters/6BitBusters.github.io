import { Module } from "@nestjs/common";
import { DataSourceController } from "./controllers/data-source.controller";
import { DataSourceService } from "./services/data-source.service";
import { ConfigService } from "@nestjs/config";
import { fetchersFactory } from "../fetchers/factories/fetchers.factory";

@Module({
  controllers: [DataSourceController],
  providers: [
    DataSourceService,
    {
      provide: "FETCHERS",
      useFactory: fetchersFactory,
      inject: [ConfigService],
    },
  ],
})
export class DataSourceModule {}
