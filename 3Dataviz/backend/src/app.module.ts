import { Module } from "@nestjs/common";
import { DataSourceModule } from "./modules/data-source/data-source.module";
import { DataVisualizationModule } from "./modules/data-visualization/data-visualization.module";
import { FetchersModule } from "./modules/fetchers/fetchers.module";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "./modules/cache/cache.module";

@Module({
  imports: [
    DataSourceModule,
    DataVisualizationModule,
    FetchersModule,
    //rende ConfigService disponibile ovunque
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule,
  ],
})
export class AppModule {}
