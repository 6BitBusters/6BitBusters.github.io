import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Dataset } from "src/interfaces/dataset.interface";
import { ICacheRepository } from "src/interfaces/cache-repository.interface";
import { BaseFetcher } from "../../../modules/fetchers/interfaces/base-fetcher.interface";

@Injectable()
export class DataVisualizationService {
  constructor(
    @Inject("CACHE_REPOSITORY") private cacheRepository: ICacheRepository,
    @Inject("FETCHERS") private fetchers: BaseFetcher[],
  ) {}

  async getDatasetById(id: number): Promise<Dataset> {
    if (id < 0 || id >= this.fetchers.length) {
      throw new NotFoundException("Invalid fetcher ID");
    }
    // Controlla se il dataset è già  in cache
    const cachedDataset = await this.cacheRepository.get<Dataset>(
      id.toString(),
    );
    if (cachedDataset) {
      return cachedDataset;
    }
    // Altrimenti, chiama il fetcher per ottenere il dataset
    // e memorizzalo nella cache
    const fetcher = this.fetchers[id];
    const dataset = await fetcher.getDataset();
    await this.cacheRepository.set(id.toString(), dataset);
    return dataset;
  }
}
