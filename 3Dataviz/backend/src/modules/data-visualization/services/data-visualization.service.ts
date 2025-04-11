import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Dataset } from "src/interfaces/dataset.interface";
import { CacheService } from "../../../modules/cache/services/cache.service";
import { BaseFetcher } from "../../../modules/fetchers/services/base-fetcher";

@Injectable()
export class DataVisualizationService {
  constructor(
    private cacheService: CacheService,
    @Inject("FETCHERS") private fetchers: BaseFetcher[],
  ) {}

  async getDatasetById(id: number): Promise<Dataset> {
    if (id < 0 || id >= this.fetchers.length) {
      throw new NotFoundException("Invalid fetcher ID");
    }
    // Controlla se il dataset è già  in cache
    const cachedDataset = this.cacheService.getDatasetFromCache(id);
    if (cachedDataset) {
      return cachedDataset;
    }
    // Altrimenti, chiama il fetcher per ottenere il dataset
    // e memorizzalo nella cache
    const fetcher = this.fetchers[id];
    const dataset = await fetcher.fetchData();
    this.cacheService.saveDatasetToCache(id, dataset);
    return dataset;
  }
}
