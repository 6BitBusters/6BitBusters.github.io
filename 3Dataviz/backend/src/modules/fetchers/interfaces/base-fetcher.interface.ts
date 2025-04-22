import { RawDataset } from "src/interfaces/raw-dataset.interface";
import { Legend } from "src/interfaces/legend.interface";

export interface BaseFetcher {
  getName(): string;
  getSize(): [number, number];
  getDescription(): string;
  getLegend(): Legend;
  getDataset(): Promise<RawDataset>;
}
