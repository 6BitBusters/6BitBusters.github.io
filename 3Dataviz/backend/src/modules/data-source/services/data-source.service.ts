import { Inject, Injectable } from "@nestjs/common";
import { BaseFetcher } from "./base-fetcher";

export type DataSource = {
  id: number;
  name: string;
  size: [number, number];
  description: string;
};

@Injectable()
export class DataSourceService {
  constructor(@Inject("FETCHERS") private fetchers: BaseFetcher[]) {}
  getSources() {
    const sources: DataSource[] = this.fetchers.map((fetcher, index) => ({
      id: index,
      name: fetcher.getName(),
      size: fetcher.getSize(),
      description: fetcher.getDescription(),
    }));
    return sources;
  }
}
