import { DatasetInfo } from "./datasetInfo";

export type DataSourceState = {
  datasets: DatasetInfo[];
  currentDataset: DatasetInfo | null;
};
