import { DatasetInfo } from "./DatasetInfo"

export type DataSourceState = {
    datasets: DatasetInfo[],
    currentDataset: DatasetInfo | null
}