import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { BaseFetcher } from "../interfaces/base-fetcher.interface";
import { BaseApiFetcher } from "./base-api-fetcher";
import axios from "axios";
import { POPULATION_API_CONFIG } from "../config";
import { RawDataset } from "../../../interfaces/raw-dataset.interface";
import { Entry } from "../../../interfaces/entry.interface";
import { Legend } from "../../../interfaces/legend.interface";
import { PopulationData } from "../interfaces/population-data.interface";

@Injectable()
export class PopulationApiFetcher
  extends BaseApiFetcher<PopulationData[]>
  implements BaseFetcher
{
  private buildUrl(): string {
    const countryCode = POPULATION_API_CONFIG.COUNTRIES.map(
      (country) => country.countryCode,
    ).join(";");
    const startYear = POPULATION_API_CONFIG.START_YEAR;
    const endYear = POPULATION_API_CONFIG.END_YEAR;
    const baseUrl = POPULATION_API_CONFIG.BASE_URL;
    const url = baseUrl
      .replace("@COUNTRY_CODE@", countryCode)
      .replace("@START_YEAR@", startYear.toString())
      .replace("@END_YEAR@", endYear.toString());
    return url;
  }

  getName(): string {
    return POPULATION_API_CONFIG.NAME;
  }

  getSize(): [number, number] {
    const numYears =
      POPULATION_API_CONFIG.END_YEAR - POPULATION_API_CONFIG.START_YEAR + 1;
    const numCountries = POPULATION_API_CONFIG.COUNTRIES.length;
    return [numYears, numCountries];
  }

  getDescription(): string {
    return POPULATION_API_CONFIG.DESCRIPTION;
  }

  getLegend(): Legend {
    return POPULATION_API_CONFIG.LEGEND;
  }

  protected async fetchData(): Promise<PopulationData[]> {
    try {
      const url = this.buildUrl();
      const response = await axios.get<PopulationData[]>(url);
      const data = response.data;
      return data;
    } catch (error) {
      throw new ServiceUnavailableException(
        `Errore nel recupero dei dati\n${error}`,
      );
    }
  }

  protected transformData(data: PopulationData[]): RawDataset {
    const entries: Entry[] = [];
    try {
      const records = data[data.length - 1];
      // Array di tutti gli anni in ordine crescente, escludendo i duplicati
      const xLabels = [...new Set(records.map((entry) => entry.date))].sort();
      const zLabels = POPULATION_API_CONFIG.COUNTRIES.map(
        (country) => country.name,
      );
      records.forEach((record) => {
        const xIndex = xLabels.indexOf(record.date);
        const zIndex = zLabels.indexOf(
          POPULATION_API_CONFIG.COUNTRIES.find(
            (country) => country.countryCode === record.countryiso3code,
          )!.name,
        );
        const entry: Entry = {
          id: xIndex * zLabels.length + zIndex,
          x: xIndex,
          // Convert to millions
          y: record.value / 1000000,
          z: zIndex,
        };
        entries.push(entry);
      });
      const dataset: RawDataset = {
        data: entries,
        xLabels: xLabels,
        zLabels: zLabels,
      };
      return dataset;
    } catch (error) {
      throw new Error(`Formato dei dati non valido\n${error}`);
    }
  }
}
