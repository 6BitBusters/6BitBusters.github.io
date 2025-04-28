import { Controller, Get } from "@nestjs/common";
import { DataSourceService } from "../services/data-source.service";
import { DataSourceDto } from "../dto/data-source.dto";

@Controller("data-source")
export class DataSourceController {
  constructor(private dataSourceService: DataSourceService) {}

  @Get()
  getSources(): DataSourceDto[] {
    return this.dataSourceService.getSources();
  }
}
