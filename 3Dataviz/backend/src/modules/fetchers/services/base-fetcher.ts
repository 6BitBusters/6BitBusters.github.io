import { Dataset } from "src/interfaces/dataset.interface";

export abstract class BaseFetcher {
  abstract getName(): string;
  abstract getSize(): [number, number];
  abstract getDescription(): string;
  abstract fetchData(): Promise<Dataset>;
  protected abstract transformData(data: any): Dataset;
}
