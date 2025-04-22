import { Dataset } from "src/interfaces/dataset.interface";

export interface BaseFetcher {
  getName(): string;
  getSize(): [number, number];
  getDescription(): string;
  getDataset(): Promise<Dataset>;
}
