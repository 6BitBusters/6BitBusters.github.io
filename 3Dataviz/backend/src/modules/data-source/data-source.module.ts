import { Module } from "@nestjs/common";
import { DataSourceController } from "./controllers/data-source.controller";
import { DataSourceService } from "./services/data-source.service";

@Module({
  controllers: [DataSourceController],
  providers: [DataSourceService],
})
export class DataSourceModule {}
