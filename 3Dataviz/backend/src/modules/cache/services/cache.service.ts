import { Injectable } from "@nestjs/common";
import { Dataset } from "src/interfaces/dataset.interface";

@Injectable()
export class CacheService {
  getDatasetFromCache(id: number): Dataset | null {
    // Simulate fetching a dataset from cache
    return {
      data: [],
      legend: {
        x: "",
        y: "",
        z: "",
      },
      xLabels: [id.toString()],
      zLabels: [],
    };
  }

  saveDatasetToCache(id: number, dataset: Dataset): void {
    // Simulate storing a dataset in cache
    console.log(`Dataset with ID ${id} stored in cache.${dataset.xLabels[0]}`);
  }
}
