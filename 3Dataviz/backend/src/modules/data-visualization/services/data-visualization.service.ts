import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DatasetDto } from "src/modules/data-visualization/dto/dataset.dto";
import { IRepository } from "src/interfaces/repository.interface";
import { BaseFetcher } from "../../../modules/fetchers/interfaces/base-fetcher.interface";

@Injectable()
export class DataVisualizationService {
  constructor(
    @Inject("CACHE_REPOSITORY") private cacheRepository: IRepository,
    @Inject("FETCHERS") private fetchers: BaseFetcher[],
  ) {}

  async getDatasetById(id: number): Promise<DatasetDto> {
    if (id < 0 || id >= this.fetchers.length) {
      throw new NotFoundException("Invalid fetcher ID");
    }
    // Controlla se il dataset è già  in cache
    const cachedDataset = await this.cacheRepository.get<DatasetDto>(
      id.toString(),
    );
    if (cachedDataset) {
      return cachedDataset;
    }

    // Altrimenti, chiama il fetcher per ottenere il dataset
    const fetcher = this.fetchers[id];
    const rawDataset = await fetcher.getDataset();
    const legend = fetcher.getLegend();

    //combina i dati e la legenda in un oggetto DatasetDto
    const datasetDto: DatasetDto = {
      data: rawDataset.data,
      legend: legend,
      xLabels: rawDataset.xLabels,
      zLabels: rawDataset.zLabels,
    };

    // e memorizzalo nella cache
    await this.cacheRepository.set(id.toString(), datasetDto);
    return datasetDto;
  }
}
