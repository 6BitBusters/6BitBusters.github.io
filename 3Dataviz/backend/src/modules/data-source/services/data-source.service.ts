import { Inject, Injectable } from "@nestjs/common";
import { BaseFetcher } from "../../fetchers/interfaces/base-fetcher.interface";
import { DataSourceDto } from "../dto/data-source.dto";

@Injectable()
export class DataSourceService {
  constructor(@Inject("FETCHERS") private fetchers: BaseFetcher[]) {}
  getSources() {
    const sources = this.fetchers.map(
      (fetcher, index) =>
        new DataSourceDto(
          index,
          fetcher.getName(),
          fetcher.getSize(),
          fetcher.getDescription(),
        ),
    );
    return sources;
  }
}
