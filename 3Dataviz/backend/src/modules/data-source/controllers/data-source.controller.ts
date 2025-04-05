import { Controller, Get } from "@nestjs/common";
import { DataSource, DataSourceService } from "../services/data-source.service";

@Controller("data-source")
export class DataSourceController {
  constructor(private dataSourceService: DataSourceService) {}

  @Get()
  getSources(): DataSource[] {
    return this.dataSourceService.getSources();
  }
}
