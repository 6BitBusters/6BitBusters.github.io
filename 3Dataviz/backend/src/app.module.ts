import { Module } from "@nestjs/common";
import { DataSourceModule } from "./modules/data-source/data-source.module";
import { DataVisualizationModule } from "./modules/data-visualization/data-visualization.module";

@Module({
  imports: [DataSourceModule, DataVisualizationModule],
})
export class AppModule {}
