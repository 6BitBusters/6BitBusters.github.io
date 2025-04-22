import { ServiceUnavailableException } from "@nestjs/common";
import { RawDataset } from "src/interfaces/raw-dataset.interface";

export abstract class BaseApiFetcher<T> {

  async getDataset(): Promise<RawDataset> {
      try {
        const data = await this.fetchData();
        return this.transformData(data);
      } catch (error) {
        throw new ServiceUnavailableException(
          `Errore nel recupero dei dati\n${error}`,
        );
      }
    }

  protected abstract fetchData(): Promise<T>;
  protected abstract transformData(data: T): RawDataset;
}
