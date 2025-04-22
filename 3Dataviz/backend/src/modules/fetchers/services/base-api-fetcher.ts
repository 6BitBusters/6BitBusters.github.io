import { Dataset } from "src/interfaces/dataset.interface";

export abstract class BaseApiFetcher<T> {
  protected abstract fetchData(): Promise<T>;
  protected abstract transformData(data: T): Dataset;
}
